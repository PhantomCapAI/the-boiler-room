const { generateState, signState, setSessionCookie } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'GitHub client ID not configured' });
  }

  const state = generateState();
  const signed = signState(state);

  // Set state cookie for CSRF verification
  res.setHeader('Set-Cookie', [
    `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  ]);

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'read:user repo',
    state: signed,
    allow_signup: 'true'
  });

  res.writeHead(302, {
    Location: `https://github.com/login/oauth/authorize?${params.toString()}`
  });
  res.end();
};
