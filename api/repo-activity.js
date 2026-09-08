const { getSessionFromReq } = require('./auth/_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = getSessionFromReq(req);
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { owner, repo } = req.query;
  if (!owner || !repo) {
    return res.status(400).json({ error: 'Missing owner or repo' });
  }

  // Validate owner/repo format to prevent injection
  if (!/^[a-zA-Z0-9._-]+$/.test(owner) || !/^[a-zA-Z0-9._-]+$/.test(repo)) {
    return res.status(400).json({ error: 'Invalid repo format' });
  }

  try {
    // Fetch recent commits and PR count in parallel
    const [commitsRes, prsRes, issuesRes] = await Promise.all([
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
        {
          headers: {
            'Authorization': `Bearer ${session.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'the-boiler-room'
          }
        }
      ),
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=1`,
        {
          headers: {
            'Authorization': `Bearer ${session.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'the-boiler-room'
          }
        }
      ),
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=1`,
        {
          headers: {
            'Authorization': `Bearer ${session.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'the-boiler-room'
          }
        }
      )
    ]);

    let latestCommit = null;
    if (commitsRes.ok) {
      const commits = await commitsRes.json();
      if (commits.length > 0) {
        const c = commits[0];
        latestCommit = {
          sha: c.sha ? c.sha.substring(0, 7) : '',
          message: c.commit && c.commit.message ? c.commit.message.split('\n')[0] : '',
          date: c.commit && c.commit.author ? c.commit.author.date : ''
        };
      }
    }

    let openPRs = 0;
    if (prsRes.ok) {
      const prHeader = prsRes.headers.get('link') || '';
      const prMatch = prHeader.match(/page=(\d+)>; rel="last"/);
      openPRs = prMatch ? parseInt(prMatch[1], 10) : (prsRes.status === 200 ? '1+' : 0);
    }

    let openIssues = 0;
    if (issuesRes.ok) {
      const issueHeader = issuesRes.headers.get('link') || '';
      const issueMatch = issueHeader.match(/page=(\d+)>; rel="last"/);
      openIssues = issueMatch ? parseInt(issueMatch[1], 10) : (issuesRes.status === 200 ? '1+' : 0);
    }

    res.setHeader('Cache-Control', 'private, no-cache');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      latestCommit,
      openPRs,
      openIssues
    }));

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch repo activity' });
  }
};
