const { verifyState, createSession, setSessionCookie, clearSessionCookie } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing code or state' });
  }

  // Verify CSRF state
  const cookies = parseCookies(req);
  const savedState = cookies.oauth_state;
  if (!savedState || !verifyState(savedState, state)) {
    return res.status(403).json({ error: 'Invalid state parameter' });
  }

  // Exchange code for access token
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        state: state
      })
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return res.status(401).json({ error: tokenData.error_description || 'Token exchange failed' });
    }

    const accessToken = tokenData.access_token;

    // Fetch user info
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'the-boiler-room'
      }
    });

    if (!userRes.ok) {
      return res.status(500).json({ error: 'Failed to fetch user info' });
    }

    const user = await userRes.json();

    // Create session and set cookie
    const sessionToken = createSession(user, accessToken);
    setSessionCookie(res, sessionToken);

    // Clear state cookie (append so the session cookie above is preserved)
    res.appendHeader('Set-Cookie', 'oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');

    // Redirect to the application root; the SPA boots to the dashboard when a session exists
    res.writeHead(302, { Location: '/' });
    res.end();

  } catch (err) {
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};
  header.split(';').forEach(c => {
    const [key, ...val] = c.split('=');
    if (key) cookies[key.trim()] = decodeURIComponent(val.join('='));
  });
  return cookies;
}
