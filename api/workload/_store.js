'use strict';

const TTL_SECONDS = 24 * 60 * 60; // records self-expire after 24h

const FRESH_MS = require('./_lib').FRESH_MS;

function createStore() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (url && token) return new UpstashStore(url, token);
  if (BlobStore.isConfigured()) return new BlobStore();
  return new MemoryStore();
}

/* Vercel Blob — persistent, cross-instance, free tier. One file per session
   (each written only by its owning process => no shared-state write races),
   discovered by prefix listing. Enabled when the Blob credentials Vercel
   injects are present (BLOB_READ_WRITE_TOKEN, or OIDC token + BLOB_STORE_ID). */
class BlobStore {
  constructor() {
    this.kind = 'blob';
    this.prefix = 'workload/s/';
    const sdk = require('@vercel/blob');
    this.blobPut = sdk.put;
    this.blobGet = sdk.get;
    this.blobList = sdk.list;
    this.blobDel = sdk.del;
  }

  static isConfigured() {
    if (process.env.BLOB_READ_WRITE_TOKEN) return true;
    return !!(process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID);
  }

  async upsert(session) {
    await this.blobPut(`${this.prefix}${session.sessionID}.json`, JSON.stringify(session), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60
    });
  }

  async remove(sessionID) {
    await this.blobDel(`${this.prefix}${sessionID}.json`);
  }

  async list() {
    const { blobs } = await this.blobList({ prefix: this.prefix, limit: 500 });
    const sessions = [];
    const staleGcMs = TTL_SECONDS * 1000;
    for (const meta of blobs || []) {
      if (!String(meta.pathname || meta.url || '').endsWith('.json')) continue;
      let session;
      try {
        const result = await this.blobGet(meta.pathname || meta.url, {
          access: 'private',
          useCache: false
        });
        if (!result || result.statusCode !== 200 || !result.stream) continue;
        const text = await new Response(result.stream).text();
        session = JSON.parse(text);
      } catch {
        continue;
      }
      if (!session || !session.sessionID) continue;
      const lastSeen = Number(session.lastSeen) || 0;
      if (Date.now() - lastSeen > staleGcMs) {
        try { await this.blobDel(meta.pathname || meta.url); } catch { /* best effort */ }
        continue;
      }
      sessions.push(session);
    }
    return sessions;
  }
}

/* Vercel KV / Upstash Redis REST — persistent, TTL-backed, free tier.
   One key per session (SETEX TTL) + an index SET so GET can list quickly. */
class UpstashStore {
  constructor(url, token) {
    this.kind = 'upstash';
    this.url = String(url).replace(/\/$/, '');
    this.token = token;
  }

  async cmd(path, body) {
    const res = await fetch(`${this.url}/${path}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`KV ${path} failed (${res.status})`);
    return res.json();
  }

  async upsert(session) {
    await this.cmd('pipeline', [
      ['SETEX', `br:sess:${session.sessionID}`, TTL_SECONDS, JSON.stringify(session)],
      ['SADD', 'br:sess:index', session.sessionID]
    ]);
  }

  async remove(sessionID) {
    await this.cmd('pipeline', [
      ['SREM', 'br:sess:index', sessionID],
      ['DEL', `br:sess:${sessionID}`]
    ]);
  }

  async list() {
    const set = await this.cmd('smembers', ['br:sess:index']);
    if (!Array.isArray(set) || set.length === 0) return [];
    const vals = await this.cmd('mget', set.map(id => `br:sess:${id}`));
    if (!Array.isArray(vals)) return [];
    return vals
      .map(v => { try { return JSON.parse(v); } catch { return null; } })
      .filter(Boolean);
  }
}

/* Fallback only: ephemeral, per-instance, lost across cold starts.
   The API reports `store: "memory"` and the dashboard warns about it. */
class MemoryStore {
  constructor() {
    this.kind = 'memory';
    this.map = new Map();
  }

  async upsert(session) {
    this.map.set(session.sessionID, Object.assign({}, session));
  }

  async remove(sessionID) {
    this.map.delete(sessionID);
  }

  async list() {
    return Array.from(this.map.values()).map(r => Object.assign({}, r));
  }
}

module.exports = { createStore, TTL_SECONDS, FRESH_MS };