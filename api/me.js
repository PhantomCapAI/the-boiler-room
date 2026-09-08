const { getSessionFromReq } = require('./auth/_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = getSessionFromReq(req);
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.setHeader('Cache-Control', 'private, no-cache');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    id: session.sub,
    login: session.login,
    avatar_url: session.avatar_url
  }));
};
