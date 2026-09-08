const test = require('node:test');
const assert = require('node:assert');

const lib = require('../api/auth/_lib');
const login = require('../api/auth/login');
const callback = require('../api/auth/callback');
const logout = require('../api/auth/logout');
const me = require('../api/me');
const repos = require('../api/repos');

function makeRes() {
  const res = {
    headers: {},
    _chunks: [],
    statusCode: 200,
    ended: false,
    setHeader(k, v) { this.headers[k] = v; },
    appendHeader(k, v) {
      this.headers[k] = this.headers[k] ? [].concat(this.headers[k], v) : v;
    },
    status(c) { this.statusCode = c; return this; },
    json(o) { this._chunks.push(JSON.stringify(o)); this.ended = true; return this; },
    writeHead(code, headers) { this.statusCode = code; this.writeHeadHeaders = headers || {}; },
    end(s) { if (s) this._chunks.push(s); this.ended = true; }
  };
  return res;
}

function makeReq(query, headers) {
  return { method: 'GET', query: query || {}, headers: { cookie: (headers && headers.Cookie) || (headers && headers.cookie) || '' } };
}

function cookieText(cookieHeader) { return String(cookieHeader); }

process.env.SESSION_SECRET = 'test-session-secret-with-sufficient-length-for-hmac';
process.env.GITHUB_CLIENT_ID = 'Iv1_test_client';
process.env.GITHUB_CLIENT_SECRET = 'test-client-secret';

test('lib: sign/verify round trip and expiry', () => {
  const t = lib.createSession({ id: 42, login: 'ghost', avatar_url: 'https://x/a.png' }, 'tok');
  const session = ({ token }) => lib.getSessionFromReq({ headers: { cookie: `session=${token}` } });
  const seen = session({ token: t });
  assert.ok(seen);
  assert.equal(seen.sub, 42);
  assert.equal(seen.login, 'ghost');
  assert.equal(seen.token, 'tok');
  assert.ok(seen.exp > Math.floor(Date.now() / 1000));

  // tampered signature rejected
  const tampered = t.slice(0, -1) + (t.endsWith('a') ? 'b' : 'a');
  assert.equal(session({ token: tampered }), null);
  // wrong secret rejected
  process.env.SESSION_SECRET = 'different-secret-value';
  assert.equal(session({ token: t }), null);
  process.env.SESSION_SECRET = 'test-session-secret-with-sufficient-length-for-hmac';
  // expired rejected
  const crypto = require('crypto');
  function fakeSign(payload) {
    const h = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const b = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const s = crypto.createHmac('sha256', process.env.SESSION_SECRET).update(h + '.' + b).digest('base64url');
    return h + '.' + b + '.' + s;
  }
  const expired = fakeSign({ sub: 1, login: 'x', token: 't', exp: -500 });
  assert.equal(session({ token: expired }), null);
});

test('login: 500 when client ID missing', async () => {
  delete process.env.GITHUB_CLIENT_ID;
  const res = makeRes();
  await login(makeReq(), res);
  assert.equal(res.statusCode, 500);
  assert.ok(res._chunks[0].includes('GitHub client ID not configured'));
  process.env.GITHUB_CLIENT_ID = 'Iv1_test_client';
});

test('login: redirects to GitHub OAuth with signed state and HttpOnly state cookie', async () => {
  const res = makeRes();
  await login(makeReq(), res);
  assert.equal(res.statusCode, 302);
  const loc = res.writeHeadHeaders.Location;
  assert.ok(loc.startsWith('https://github.com/login/oauth/authorize?'));
  assert.ok(loc.includes('client_id=Iv1_test_client'));
  assert.ok(loc.includes('scope='));
  assert.ok(loc.includes('state='));
  const stateParam = decodeURIComponent(loc.match(/state=([^&]+)/)[1]);
  const ck = cookieText(res.headers['Set-Cookie']);
  const rawState = ck.split(';')[0].split('=')[1];
  assert.ok(lib.verifyState(rawState, stateParam), 'signed state must correspond to cookie state');
  assert.ok(ck.includes('HttpOnly') && ck.includes('Secure') && ck.includes('SameSite=Lax'));
});

test('callback: 400 when code/state missing', async () => {
  const res = makeRes();
  await callback(makeReq({}, { cookie: 'oauth_state=abc' }), res);
  assert.equal(res.statusCode, 400);
});

test('callback: 403 on invalid state', async () => {
  const res = makeRes();
  await callback(makeReq({ code: 'x', state: 'wrong' }, { cookie: 'oauth_state=abc' }), res);
  assert.equal(res.statusCode, 403);
});

test('callback: GitHub token error surfaces cleanly (401)', async () => {
  const raw = lib.generateState();
  const signed = lib.signState(raw);
  global.fetch = async () => ({ ok: true, json: async () => ({ error: 'bad_verification_code', error_description: 'The code passed is incorrect or expired.' }) });
  const res = makeRes();
  await callback(makeReq({ code: 'bad', state: signed }, { cookie: `oauth_state=${raw}` }), res);
  assert.equal(res.statusCode, 401);
  assert.ok(res._chunks[0].includes('incorrect or expired'));
  global.fetch = undefined;
});

test('callback: success sets BOTH session and clears oauth_state, redirects to "/"', async () => {
  const raw = lib.generateState();
  const signed = lib.signState(raw);
  global.fetch = async (url) => {
    if (url === 'https://github.com/login/oauth/access_token') {
      return { ok: true, json: async () => ({ access_token: 'gho_abc123' }) };
    }
    if (url === 'https://api.github.com/user') {
      return { ok: true, json: async () => ({ id: 777, login: 'phantomcapai', avatar_url: 'https://a/a.png' }) };
    }
    throw new Error('unexpected url');
  };
  const res = makeRes();
  await callback(makeReq({ code: 'good', state: signed }, { cookie: `oauth_state=${raw}` }), res);

  assert.equal(res.statusCode, 302);
  assert.equal(res.writeHeadHeaders.Location, '/');

  const setCookies = res.headers['Set-Cookie'];
  assert.ok(Array.isArray(setCookies), 'Set-Cookie header must be an array; session cookie must not be overwritten');
  assert.equal(setCookies.length, 2);
  const session = cookieText(setCookies[0]);
  assert.ok(session.startsWith('session='), 'session cookie delivered');
  assert.ok(session.includes('HttpOnly') && session.includes('Secure') && session.includes('SameSite=Lax'));
  assert.ok(session.includes('Max-Age=604800'));
  const stateCleanup = cookieText(setCookies[1]);
  assert.ok(stateCleanup.startsWith('oauth_state=') && stateCleanup.includes('Max-Age=0'), 'oauth_state cookie cleared');

  const sessionToken = session.split(';')[0].replace('session=', '');
  const payload = lib.getSessionFromReq({ headers: { cookie: `session=${sessionToken}` } });
  assert.equal(payload.sub, 777);
  assert.equal(payload.login, 'phantomcapai');
  assert.equal(payload.token, 'gho_abc123');
  global.fetch = undefined;
});

test('callback: fetch failure returns clean 500, no leak', async () => {
  const raw = lib.generateState();
  const signed = lib.signState(raw);
  global.fetch = async () => { throw new Error('network exploded with secret=SESAME'); };
  const res = makeRes();
  await callback(makeReq({ code: 'x', state: signed }, { cookie: `oauth_state=${raw}` }), res);
  assert.equal(res.statusCode, 500);
  assert.ok(res._chunks[0].includes('Authentication failed'));
  assert.ok(!res._chunks[0].includes('SESAME'));
  global.fetch = undefined;
});

test('logout: redirects to "/" and clears session cookie', async () => {
  await callback_ok();
  const res = makeRes();
  await logout(makeReq(), res);
  assert.equal(res.statusCode, 302);
  assert.equal(res.writeHeadHeaders.Location, '/');
  const ck = res.headers['Set-Cookie'];
  assert.ok(ck.includes('session=;'));
  assert.ok(ck.includes('Max-Age=0'));
});

async function callback_ok() {
  const raw = lib.generateState();
  const signed = lib.signState(raw);
  global.fetch = async (url) => url.includes('access_token')
    ? { ok: true, json: async () => ({ access_token: 'tok' }) }
    : { ok: true, json: async () => ({ id: 1, login: 'u', avatar_url: 'a' }) };
  const res = makeRes();
  await callback(makeReq({ code: 'c', state: signed }, { cookie: `oauth_state=${raw}` }), res);
  global.fetch = undefined;
  const setCookies = res.headers['Set-Cookie'];
  return setCookies[0].split(';')[0].replace('session=', '');
}

test('me: unauthenticated returns 401', async () => {
  const res = makeRes();
  await me(makeReq(), res);
  assert.equal(res.statusCode, 401);
});

test('me: authenticated session returns user info', async () => {
  const token = await callback_ok();
  const res = makeRes();
  await me(makeReq({}, { cookie: `session=${token}` }), res);
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res._chunks[0]);
  assert.equal(body.id, 1);
  assert.equal(body.login, 'u');
  assert.ok(!body.token, 'access token must not leak via /api/me');
});

test('repos: unauthenticated returns 401', async () => {
  const res = makeRes();
  await repos(makeReq(), res);
  assert.equal(res.statusCode, 401);
});