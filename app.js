(() => {
  'use strict';

  const SEED_DATA = [
    {
      id: 1,
      name: 'example-api',
      full_name: 'acme/example-api',
      private: false,
      html_url: 'https://github.com/acme/example-api',
      description: 'REST API service for user management',
      language: 'TypeScript',
      default_branch: 'main',
      updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      pushed_at: new Date(Date.now() - 3600000).toISOString(),
      stargazers_count: 24,
      forks_count: 3,
      open_issues_count: 5,
      owner: { login: 'acme', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' }
    },
    {
      id: 2,
      name: 'example-frontend',
      full_name: 'acme/example-frontend',
      private: false,
      html_url: 'https://github.com/acme/example-frontend',
      description: 'React dashboard with authentication',
      language: 'JavaScript',
      default_branch: 'main',
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      pushed_at: new Date(Date.now() - 43200000).toISOString(),
      stargazers_count: 12,
      forks_count: 1,
      open_issues_count: 8,
      owner: { login: 'acme', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' }
    },
    {
      id: 3,
      name: 'example-agent',
      full_name: 'acme/example-agent',
      private: true,
      html_url: 'https://github.com/acme/example-agent',
      description: 'Python AI agent for automated testing',
      language: 'Python',
      default_branch: 'main',
      updated_at: new Date(Date.now() - 172800000).toISOString(),
      pushed_at: new Date(Date.now() - 86400000).toISOString(),
      stargazers_count: 45,
      forks_count: 7,
      open_issues_count: 2,
      owner: { login: 'acme', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' }
    },
    {
      id: 4,
      name: 'example-docs',
      full_name: 'acme/example-docs',
      private: false,
      html_url: 'https://github.com/acme/example-docs',
      description: 'Documentation site for internal APIs',
      language: 'HTML',
      default_branch: 'main',
      updated_at: new Date(Date.now() - 604800000).toISOString(),
      pushed_at: new Date(Date.now() - 604800000).toISOString(),
      stargazers_count: 5,
      forks_count: 2,
      open_issues_count: 0,
      owner: { login: 'acme', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' }
    }
  ];

  const STORAGE_KEY = 'boilerroom_metadata';
  let state = {
    repos: [],
    metadata: {},
    filter: 'all',
    search: '',
    sortBy: 'updated',
    currentRepo: null,
    isDemo: false,
    user: null
  };

  // --- Persistence ---
  function loadMetadata() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }
  function saveMetadata() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.metadata));
  }
  function getMeta(id) {
    if (!state.metadata[id]) {
      state.metadata[id] = { tags: [], sessionNotes: '', aiContext: '', pinned: false };
    }
    return state.metadata[id];
  }

  // --- Auth ---
  async function checkAuth() {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const user = await res.json();
        state.user = user;
        state.isDemo = false;
        return true;
      }
    } catch {}
    return false;
  }

  async function fetchRepos() {
    try {
      const res = await fetch('/api/repos');
      if (!res.ok) throw new Error('Failed to fetch repos');
      return await res.json();
    } catch {
      return null;
    }
  }

  // --- View switching ---
  function showLanding() {
    document.getElementById('landing').style.display = '';
    document.getElementById('dashboard').style.display = 'none';
    renderHeaderNav();
  }

  function showDashboard() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('dashboard').style.display = '';
    renderHeaderNav();
    renderOverview();
    renderRepos();
  }

  function renderHeaderNav() {
    const nav = document.getElementById('headerNav');
    if (state.user) {
      nav.innerHTML = `
        <div class="nav-user">
          <img class="nav-avatar" src="${state.user.avatar_url}" alt="${state.user.login}">
          <span class="nav-login">${state.user.login}</span>
        </div>
        <a href="/api/auth/logout" class="btn btn-sm btn-ghost">Sign out</a>
      `;
    } else if (state.isDemo) {
      nav.innerHTML = `
        <span class="demo-badge">Demo Mode</span>
        <button class="btn btn-sm btn-ghost" onclick="exitDemo()">Exit Demo</button>
      `;
    } else {
      nav.innerHTML = '';
    }
  }

  // --- Overview ---
  function renderOverview() {
    const repos = state.repos;
    document.getElementById('statTotal').textContent = repos.length;
    document.getElementById('statAnnotated').textContent = repos.filter(r => {
      const m = state.metadata[r.id] || state.metadata[r.full_name];
      return m && (m.tags.length > 0 || m.aiContext || m.sessionNotes);
    }).length;
    document.getElementById('statPinned').textContent = repos.filter(r => {
      const m = state.metadata[r.id] || state.metadata[r.full_name];
      return m && m.pinned;
    }).length;
    document.getElementById('statLast24h').textContent = repos.filter(r => {
      const t = new Date(r.pushed_at).getTime();
      return Date.now() - t < 86400000;
    }).length;
  }

  // --- Repo grid ---
  function renderRepos() {
    const grid = document.getElementById('repoGrid');
    const empty = document.getElementById('emptyState');
    let repos = [...state.repos];

    // Search
    if (state.search) {
      const q = state.search.toLowerCase();
      repos = repos.filter(r => {
        const m = getMetaKey(r);
        const meta = state.metadata[m] || {};
        return r.name.toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q) ||
          (r.language || '').toLowerCase().includes(q) ||
          (meta.tags || []).some(t => t.toLowerCase().includes(q)) ||
          (meta.sessionNotes || '').toLowerCase().includes(q) ||
          (meta.aiContext || '').toLowerCase().includes(q);
      });
    }

    // Filter
    if (state.filter === 'pinned') {
      repos = repos.filter(r => {
        const m = state.metadata[getMetaKey(r)];
        return m && m.pinned;
      });
    } else if (state.filter === 'annotated') {
      repos = repos.filter(r => {
        const m = state.metadata[getMetaKey(r)];
        return m && (m.tags.length > 0 || m.aiContext || m.sessionNotes);
      });
    }

    // Sort
    repos.sort((a, b) => {
      const ma = state.metadata[getMetaKey(a)] || {};
      const mb = state.metadata[getMetaKey(b)] || {};
      if (ma.pinned && !mb.pinned) return -1;
      if (!ma.pinned && mb.pinned) return 1;
      switch (state.sortBy) {
        case 'pushed': return new Date(b.pushed_at) - new Date(a.pushed_at);
        case 'alpha': return a.name.localeCompare(b.name);
        case 'stars': return b.stargazers_count - a.stargazers_count;
        default: return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });

    if (repos.length === 0) {
      grid.innerHTML = '';
      empty.style.display = '';
      return;
    }
    empty.style.display = 'none';

    grid.innerHTML = repos.map(r => {
      const key = getMetaKey(r);
      const meta = state.metadata[key] || {};
      const tags = (meta.tags || []).slice(0, 3);
      const ago = timeAgo(r.pushed_at);
      const isPrivate = r.private;
      return `
        <div class="repo-card ${meta.pinned ? 'pinned' : ''}" onclick="openModal('${escHtml(r.full_name)}')" tabindex="0" role="button" aria-label="Open ${escHtml(r.name)}">
          <div class="repo-header">
            <div class="repo-name-row">
              <span class="repo-name">${escHtml(r.name)}</span>
              ${isPrivate ? '<span class="badge badge-private">Private</span>' : ''}
              ${meta.pinned ? '<span class="badge badge-pinned">Pinned</span>' : ''}
            </div>
            <span class="repo-time">${ago}</span>
          </div>
          <p class="repo-desc">${escHtml(r.description || 'No description')}</p>
          <div class="repo-meta">
            ${r.language ? `<span class="repo-lang"><span class="lang-dot" style="background:${langColor(r.language)}"></span>${escHtml(r.language)}</span>` : ''}
            <span class="repo-stars">⭐ ${r.stargazers_count}</span>
            <span class="repo-forks">🍴 ${r.forks_count}</span>
          </div>
          ${tags.length > 0 ? `<div class="repo-tags">${tags.map(t => `<span class="tag">${escHtml(t)}</span>`).join('')}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  function getMetaKey(repo) {
    // Use full_name if we have it (authenticated mode), else id (demo mode)
    return repo.full_name || String(repo.id);
  }

  // --- Modal ---
  window.openModal = function(fullName) {
    const repo = state.repos.find(r => r.full_name === fullName || String(r.id) === fullName);
    if (!repo) return;
    state.currentRepo = repo;
    const key = getMetaKey(repo);
    const meta = getMeta(key);

    document.getElementById('modalTitle').textContent = repo.name;
    document.getElementById('modalSubtitle').textContent = repo.full_name;
    document.getElementById('modalBadges').innerHTML = `
      ${repo.private ? '<span class="badge badge-private">Private</span>' : ''}
      ${meta.pinned ? '<span class="badge badge-pinned">Pinned</span>' : ''}
    `;

    document.getElementById('editTags').value = (meta.tags || []).join(', ');
    document.getElementById('editSession').value = meta.sessionNotes || '';
    document.getElementById('editContext').value = meta.aiContext || '';
    document.getElementById('editPinned').checked = meta.pinned || false;

    document.getElementById('detailLang').textContent = repo.language || '-';
    document.getElementById('detailPush').textContent = timeAgo(repo.pushed_at);
    document.getElementById('detailPRs').textContent = repo.open_issues_count || '0';
    document.getElementById('detailIssues').textContent = repo.open_issues_count || '-';
    document.getElementById('detailCommit').textContent = repo.default_branch || '-';
    document.getElementById('detailVisibility').textContent = repo.private ? 'Private' : 'Public';

    generatePrompts(repo, meta);

    document.getElementById('modalOverlay').style.display = '';
    document.getElementById('editTags').focus();

    // Reset tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelector('.tab[data-tab="metadata"]').classList.add('active');
    document.getElementById('tabMetadata').classList.add('active');
  };

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    state.currentRepo = null;
  }

  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.tab-content[data-tab="${tab.dataset.tab}"]`).classList.add('active');
    });
  });

  // Save metadata
  window.saveMetadata = function() {
    if (!state.currentRepo) return;
    const key = getMetaKey(state.currentRepo);
    const tags = document.getElementById('editTags').value
      .split(',').map(t => t.trim()).filter(Boolean);
    state.metadata[key] = {
      tags,
      sessionNotes: document.getElementById('editSession').value,
      aiContext: document.getElementById('editContext').value,
      pinned: document.getElementById('editPinned').checked
    };
    saveMetadata();
    renderOverview();
    renderRepos();
    showToast('Metadata saved');
  };

  // --- Prompts ---
  function generatePrompts(repo, meta) {
    const ctx = `Repo: ${repo.full_name}\nDescription: ${repo.description || 'N/A'}\nLanguage: ${repo.language || 'N/A'}\nBranch: ${repo.default_branch}\nTags: ${(meta.tags || []).join(', ') || 'none'}\nAI Context: ${meta.aiContext || 'none'}`;
    document.getElementById('promptContextText').textContent = ctx;

    const resume = meta.sessionNotes
      ? `Resume session for ${repo.full_name}.\nLast session notes:\n${meta.sessionNotes}\n\nContinue from where we left off.`
      : `Start a new session for ${repo.full_name}. No previous session notes found.`;
    document.getElementById('promptResumeText').textContent = resume;
  }

  window.copyPrompt = function(type) {
    const el = type === 'context'
      ? document.getElementById('promptContextText')
      : document.getElementById('promptResumeText');
    navigator.clipboard.writeText(el.textContent).then(() => showToast('Copied to clipboard'));
  };

  // --- Import / Export / Reset ---
  window.importData = function() {
    document.getElementById('importInput').click();
  };
  document.getElementById('importInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        state.metadata = imported.metadata || imported;
        saveMetadata();
        renderOverview();
        renderRepos();
        showToast('Data imported successfully');
      } catch { showToast('Invalid JSON file'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  window.exportData = function() {
    const data = { metadata: state.metadata, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boilerroom-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported');
  };

  window.resetData = function() {
    if (confirm('Reset all local metadata? This cannot be undone.')) {
      state.metadata = {};
      saveMetadata();
      renderOverview();
      renderRepos();
      showToast('Metadata reset');
    }
  };

  // --- Search & Filter ---
  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.search = e.target.value;
    renderRepos();
  });
  document.getElementById('sortBy').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderRepos();
  });
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.filter = chip.dataset.filter;
      renderRepos();
    });
  });

  // --- Toast ---
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.getElementById('toastContainer').appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2000);
  }

  // --- Helpers ---
  function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
  function timeAgo(dateStr) {
    const secs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (secs < 60) return 'just now';
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }
  function langColor(lang) {
    const colors = { TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5', HTML: '#e34c26', CSS: '#563d7c', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516', Java: '#b07219' };
    return colors[lang] || '#8b8b8b';
  }

  // --- Demo mode ---
  window.enterDemo = function() {
    state.isDemo = true;
    state.repos = SEED_DATA;
    showDashboard();
  };

  window.exitDemo = function() {
    state.isDemo = false;
    state.user = null;
    state.repos = [];
    showLanding();
  };

  // --- Keyboard: open card with Enter ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('repo-card')) {
      e.target.click();
    }
  });

  // --- Init ---
  async function init() {
    state.metadata = loadMetadata();
    const isAuthed = await checkAuth();
    if (isAuthed) {
      document.getElementById('loadingState').style.display = '';
      const repos = await fetchRepos();
      document.getElementById('loadingState').style.display = 'none';
      if (repos) {
        state.repos = repos;
        showDashboard();
      } else {
        showLanding();
      }
    } else {
      showLanding();
    }
  }

  init();
})();
