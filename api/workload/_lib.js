'use strict';

/* Session freshness window — a record older than this (no heartbeat)
   is removed from the ACTIVE workload counters automatically. */
const FRESH_MS = 70 * 1000;

const STATUS_RANK = { ACTIVE: 0, REVIEW: 1, BLOCKED: 2, ERROR: 3, STALE: 4, DONE: 5, IDLE: 6 };
const ALLOWED_STATUS = new Set(['ACTIVE', 'REVIEW', 'BLOCKED', 'ERROR', 'DONE', 'IDLE', 'STALE']);

function cleanStatus(s) {
  const v = String(s || '').toUpperCase();
  if (v === 'WORKING') return 'ACTIVE';
  if (v === 'REVIEWING') return 'REVIEW';
  if (v === 'COMPLETE') return 'DONE';
  if (ALLOWED_STATUS.has(v)) return v;
  return 'IDLE';
}

function normTs(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : Date.now();
}

function sanitizeSession(raw) {
  const session = raw && typeof raw === 'object' ? raw : {};
  const id = String(session.sessionID || '').trim().slice(0, 200);
  if (!id) return null;
  const now = Date.now();
  return {
    sessionID: id,
    agent: String(session.agent || 'unknown').slice(0, 60),
    provider: String(session.provider || session.agent || 'unknown').slice(0, 60),
    model: String(session.model || 'unknown').slice(0, 120),
    repo: String(session.repo || '').slice(0, 200),
    project: String(session.project || '').slice(0, 160),
    directory: String(session.directory || '').slice(0, 320),
    host: String(session.host || 'unknown').slice(0, 80),
    title: String(session.title || '').slice(0, 200),
    status: cleanStatus(session.status),
    lastActivity: String(session.lastActivity || '').slice(0, 240),
    lastTool: String(session.lastTool || '').slice(0, 80),
    startedAt: Math.min(normTs(session.startedAt), now),
    lastSeen: Math.min(normTs(session.lastSeen), now),
    busy: !!session.busy,
    error: String(session.error || '').slice(0, 400)
  };
}

function computeStatus(session, nowMs) {
  const age = nowMs - session.lastSeen;
  if (age > FRESH_MS) return 'STALE';
  return cleanStatus(session.status);
}

function applyServerDerived(session, nowMs) {
  const status = computeStatus(session, nowMs);
  const out = Object.assign({}, session, { status });
  out.fresh = status !== 'STALE';
  return out;
}

function tally(sessions) {
  const counters = { ACTIVE: 0, REVIEW: 0, BLOCKED: 0, ERROR: 0, DONE: 0, IDLE: 0, STALE: 0, TOTAL: 0 };
  sessions.forEach(s => {
    if (counters[s.status] == null) counters[s.status] = 0;
    counters[s.status]++;
    counters.TOTAL++;
  });
  return counters;
}

function sortSessions(sessions) {
  return sessions.slice().sort((a, b) => {
    const r = (STATUS_RANK[a.status] != null ? STATUS_RANK[a.status] : 9) -
              (STATUS_RANK[b.status] != null ? STATUS_RANK[b.status] : 9);
    if (r !== 0) return r;
    return (b.lastSeen || 0) - (a.lastSeen || 0);
  });
}

module.exports = { FRESH_MS, cleanStatus, sanitizeSession, applyServerDerived, tally, sortSessions };