const crypto = require('crypto');

const ALGORITHM = 'sha256';
const EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('SESSION_SECRET not set');
  return s;
}

function sign(payload) {
  const secret = getSecret();
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac(ALGORITHM, secret).update(header + '.' + body).digest('base64url');
  return header + '.' + body + '.' + sig;
}

function verify(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const secret = getSecret();
    const expected = crypto.createHmac(ALGORITHM, secret).update(header + '.' + body).digest('base64url');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

function createSession(user, accessToken) {
  const now = Math.floor(Date.now() / 1000);
  return sign({
    sub: user.id,
    login: user.login,
    avatar_url: user.avatar_url,
    token: accessToken,
    iat: now,
    exp: now + EXPIRY_SECONDS
  });
}

function setSessionCookie(res, token) {
  const cookie = `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${EXPIRY_SECONDS}`;
  res.setHeader('Set-Cookie', cookie);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
}

function getSessionFromReq(req) {
  const cookies = parseCookies(req);
  const token = cookies.session;
  if (!token) return null;
  return verify(token);
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};
  header.split(';').forEach(c => {
    const [key, ...val] = c.split('=');
    if (key) cookies[key.trim()] = decodeURIComponent(val.join('='));
  });
  return cookies;
}

function generateState() {
  return crypto.randomBytes(32).toString('hex');
}

function signState(state) {
  const secret = getSecret();
  return crypto.createHmac(ALGORITHM, secret).update(state).digest('hex');
}

function verifyState(state, signed) {
  return signState(state) === signed;
}

module.exports = {
  createSession,
  setSessionCookie,
  clearSessionCookie,
  getSessionFromReq,
  generateState,
  signState,
  verifyState
};
