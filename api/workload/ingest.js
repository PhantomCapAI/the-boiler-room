'use strict';

const { createStore, TTL_SECONDS } = require('./_store');
const { sanitizeSession } = require('./_lib');

function readJson(req, maxBytes) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > (maxBytes || 1024 * 1024)) { req.destroy(); reject(new Error('Payload too large')); }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function verifyAuth(req) {
  const secret = process.env.WORKLOAD_INGEST_SECRET;
  if (!secret) return { ok: false, status: 503, error: 'Ingest not configured' };
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${secret}`) return { ok: false, status: 401, error: 'Unauthorized' };
  return { ok: true };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = verifyAuth(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  let body;
  try { body = await readJson(req); } catch { return res.status(400).json({ error: 'Bad JSON body' }); }

  const store = createStore();
  let upserted = 0;

  try {
    if (Array.isArray(body.remove)) {
      for (const id of body.remove) {
        if (typeof id === 'string' && id) await store.remove(id.trim().slice(0, 200));
      }
    }
    const entries = Array.isArray(body.sessions) ? body.sessions : (body.session ? [body.session] : []);
    for (const raw of entries) {
      const session = sanitizeSession(raw);
      if (!session) continue;
      await store.upsert(session);
      upserted++;
    }
  } catch (err) {
    return res.status(500).json({ error: 'Ingest failed' });
  }

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ok: true, store: store.kind, upserted, ttlSeconds: TTL_SECONDS });
};