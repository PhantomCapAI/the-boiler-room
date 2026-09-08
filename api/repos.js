const { getSessionFromReq } = require('./auth/_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = getSessionFromReq(req);
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const page = req.query.page || '1';
    const perPage = Math.min(parseInt(req.query.per_page, 10) || 30, 100);

    const apiRes = await fetch(
      `https://api.github.com/user/repos?page=${page}&per_page=${perPage}&sort=updated&direction=desc`,
      {
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'the-boiler-room'
        }
      }
    );

    if (!apiRes.ok) {
      if (apiRes.status === 401) {
        return res.status(401).json({ error: 'GitHub token expired' });
      }
      if (apiRes.status === 403) {
        return res.status(403).json({ error: 'GitHub API rate limit exceeded' });
      }
      return res.status(apiRes.status).json({ error: 'GitHub API error' });
    }

    const repos = await apiRes.json();

    // Return minimal repo data to reduce payload
    const minimal = repos.map(r => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      private: r.private,
      html_url: r.html_url,
      description: r.description,
      language: r.language,
      default_branch: r.default_branch,
      updated_at: r.updated_at,
      pushed_at: r.pushed_at,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      open_issues_count: r.open_issues_count,
      owner: {
        login: r.owner.login,
        avatar_url: r.owner.avatar_url
      }
    }));

    res.setHeader('Cache-Control', 'private, no-cache');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Total-Count', apiRes.headers.get('x-total-count') || '');
    res.end(JSON.stringify(minimal));

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch repositories' });
  }
};
