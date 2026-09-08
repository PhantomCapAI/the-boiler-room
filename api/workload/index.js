'use strict';

const { getSessionFromReq } = require('../auth/_lib');
const { createStore, FRESH_MS } = require('./_store');
const { applyServerDerived, tally, sortSessions } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = getSessionFromReq(req);
  const ingestSecret = process.env.WORKLOAD_INGEST_SECRET;
  const bearerOk = !!ingestSecret && (req.headers.authorization || '') === `Bearer ${ingestSecret}`;
  if (!session && !bearerOk) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const store = createStore();
    const now = Date.now();
    const raw = await store.list();
    const sessions = sortSessions(raw.map(r => applyServerDerived(r, now)));
    const counters = tally(sessions);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      asOf: now,
      freshMs: FRESH_MS,
      store: store.kind,
      counters,
      sessions
    });
  } catch (err) {
    res.status(500).json({ error: 'Workload read failed' });
  }
};