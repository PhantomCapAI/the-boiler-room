const { clearSessionCookie } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  clearSessionCookie(res);
  res.writeHead(302, { Location: '/' });
  res.end();
};
