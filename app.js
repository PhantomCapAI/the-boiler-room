(() => {
  'use strict';

  /* =========================================================
     SEED DATA — Fictional demo repos only
     ========================================================= */
  const SEED_DATA = [
    { id: 1, name: 'example-api', full_name: 'acme/example-api', private: false, html_url: 'https://github.com/acme/example-api', description: 'REST API service for user management', language: 'TypeScript', default_branch: 'main', updated_at: new Date(Date.now() - 2 * 3600000).toISOString(), pushed_at: new Date(Date.now() - 3600000).toISOString(), stargazers_count: 24, forks_count: 3, open_issues_count: 5, owner: { login: 'acme', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' } },
    { id: 2, name: 'example-frontend', full_name: 'acme/example-frontend', private: false, html_url: 'https://github.com/acme/example-frontend', description: 'React dashboard with authentication', language: 'JavaScript', default_branch: 'main', updated_at: new Date(Date.now() - 86400000).toISOString(), pushed_at: new Date(Date.now() - 43200000).toISOString(), stargazers_count: 12, forks_count: 1, open_issues_count: 8, owner: { login: 'acme', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' } },
    { id: 3, name: 'example-agent', full_name: 'acme/example-agent', private: true, html_url: 'https://github.com/acme/example-agent', description: 'Python AI agent for automated testing', language: 'Python', default_branch: 'main', updated_at: new Date(Date.now() - 172800000).toISOString(), pushed_at: new Date(Date.now() - 86400000).toISOString(), stargazers_count: 45, forks_count: 7, open_issues_count: 2, owner: { login: 'acme', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' } },
    { id: 4, name: 'example-docs', full_name: 'acme/example-docs', private: false, html_url: 'https://github.com/acme/example-docs', description: 'Documentation site for internal APIs', language: 'HTML', default_branch: 'main', updated_at: new Date(Date.now() - 604800000).toISOString(), pushed_at: new Date(Date.now() - 604800000).toISOString(), stargazers_count: 5, forks_count: 2, open_issues_count: 0, owner: { login: 'acme', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' } }
  ];

  /* =========================================================
     MODEL PALETTE — Each AI model gets a unique bot color
     ========================================================= */
  const MODEL_COLORS = {
    'Model A': '#4a9eff',
    'Model B': '#a78bfa',
    'Model C': '#f0883e',
    'Codex': '#34d058',
    'Claude': '#e3b341',
    'MiMo': '#56d4dd',
    'Local': '#8b98a8',
  };

  function getModelColor(model) {
    return MODEL_COLORS[model] || '#6b7a90';
  }

  /* =========================================================
     BOILER BOT V2 — Compact maintenance robot
     Pressure-tank body, visor face screen, six states.
     API unchanged: createBotSVG(color, state)
     ========================================================= */
  const VISOR_DARK = '#0a0e16';
  const DIAL_DARK = '#0e131b';
  const SCREEN_LIGHT = '#d8f4ff';
  const SCREEN_DARK = '#10141c';
  const STEEL = '#5a6b82';
  const STEEL_DARK = '#2a3444';
  const BRASS = '#c8a94e';

  function darkenColor(hex, pct) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - pct);
    const g = Math.max(0, ((num >> 8) & 0xff) - pct);
    const b = Math.max(0, (num & 0xff) - pct);
    return `rgb(${r},${g},${b})`;
  }

  function createBotSVG(color, state) {
    const lighter = lightenColor(color, 30);
    const darker = darkenColor(color, 45);
    let eyes, mouth, visorEdge, knob;

    switch (state) {
      case 'working': // focused slit eyes, flat determined mouth
        eyes = `<g class="bot-eye"><rect x="7.8" y="8.2" width="3.6" height="1.6" rx="0.8" fill="${SCREEN_LIGHT}"/></g><g class="bot-eye"><rect x="12.6" y="8.2" width="3.6" height="1.6" rx="0.8" fill="${SCREEN_LIGHT}"/></g>`;
        mouth = `<path d="M9.8 11.0 L14.2 11.0" stroke="${SCREEN_LIGHT}" stroke-width="0.9" stroke-linecap="round" opacity="0.85"/>`;
        visorEdge = 'none'; knob = BRASS;
        break;
      case 'reviewing': // analytical side-glance + visor scan sweep
        eyes = `<g class="bot-eye"><rect x="8.0" y="8.4" width="3.2" height="1.1" rx="0.55" fill="${SCREEN_LIGHT}" opacity="0.8"/><circle cx="10.3" cy="9.0" r="0.9" fill="${SCREEN_LIGHT}"/></g><g class="bot-eye"><rect x="12.8" y="8.4" width="3.2" height="1.1" rx="0.55" fill="${SCREEN_LIGHT}" opacity="0.8"/><circle cx="15.1" cy="9.0" r="0.9" fill="${SCREEN_LIGHT}"/></g>`;
        mouth = `<path d="M10.4 11.0 L14.2 11.0" stroke="${SCREEN_LIGHT}" stroke-width="0.8" stroke-linecap="round" opacity="0.7"/>`;
        visorEdge = 'none'; knob = BRASS;
        break;
      case 'blocked': // worried brows, wide eyes, small pupils, amber warning
        eyes = `<g class="bot-eye"><circle cx="9.6" cy="9.0" r="1.6" fill="${SCREEN_LIGHT}"/><circle cx="9.8" cy="9.4" r="0.65" fill="${SCREEN_DARK}"/></g><g class="bot-eye"><circle cx="14.4" cy="9.0" r="1.6" fill="${SCREEN_LIGHT}"/><circle cx="14.2" cy="9.4" r="0.65" fill="${SCREEN_DARK}"/></g><path d="M8.2 6.9 L10.5 6.4 M15.8 6.9 L13.5 6.4" stroke="${STEEL}" stroke-width="1.0" stroke-linecap="round"/>`;
        mouth = `<path d="M10.6 10.9 Q12 10.2 13.4 10.9" stroke="${SCREEN_LIGHT}" stroke-width="0.9" stroke-linecap="round" opacity="0.9"/>`;
        visorEdge = '#e3b341'; knob = '#e3b341';
        break;
      case 'complete': // happy arcs and wide smile
        eyes = `<g class="bot-eye"><path d="M8.0 9.6 Q9.6 7.8 11.2 9.6" stroke="${SCREEN_LIGHT}" stroke-width="1.4" fill="none" stroke-linecap="round"/></g><g class="bot-eye"><path d="M12.8 9.6 Q14.4 7.8 16.0 9.6" stroke="${SCREEN_LIGHT}" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>`;
        mouth = `<path d="M9.6 10.7 Q12 12.0 14.4 10.7" stroke="${SCREEN_LIGHT}" stroke-width="1.0" stroke-linecap="round"/>`;
        visorEdge = 'none'; knob = BRASS;
        break;
      case 'error': // X eyes, wavy mouth, red warning frame
        eyes = `<g class="bot-eye"><path d="M8.2 7.6 L11.0 10.4 M11.0 7.6 L8.2 10.4" stroke="${SCREEN_LIGHT}" stroke-width="1.5" stroke-linecap="round"/></g><g class="bot-eye"><path d="M13.0 7.6 L15.8 10.4 M15.8 7.6 L13.0 10.4" stroke="${SCREEN_LIGHT}" stroke-width="1.5" stroke-linecap="round"/></g>`;
        mouth = `<path d="M10.2 10.8 Q11.1 10.3 12 10.8 Q12.9 11.3 13.8 10.8" stroke="${SCREEN_LIGHT}" stroke-width="0.8" stroke-linecap="round" opacity="0.85"/>`;
        visorEdge = '#f85149'; knob = '#f85149';
        break;
      default: // idle — soft pill eyes, gentle smile
        eyes = `<g class="bot-eye"><rect x="7.9" y="7.4" width="3.4" height="3.0" rx="1.5" fill="${SCREEN_LIGHT}" opacity="0.92"/></g><g class="bot-eye"><rect x="12.7" y="7.4" width="3.4" height="3.0" rx="1.5" fill="${SCREEN_LIGHT}" opacity="0.92"/></g>`;
        mouth = `<path d="M9.8 10.7 Q12 11.5 14.2 10.7" stroke="${SCREEN_LIGHT}" stroke-width="0.9" stroke-linecap="round" opacity="0.85"/>`;
        visorEdge = 'none'; knob = BRASS;
    }

    return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="12" y1="4.4" x2="12" y2="2.8" stroke="${STEEL_DARK}" stroke-width="1.1" stroke-linecap="round"/>
      <circle cx="12" cy="2.2" r="1.1" fill="${knob}"/>
      <rect x="4.6" y="4.5" width="14.8" height="15.5" rx="7.4" fill="${color}"/>
      <path d="M6.2 7.4 Q7.2 6.3 8.7 6.3 L9.4 6.4" stroke="${lighter}" stroke-width="0.8" fill="none" stroke-linecap="round" opacity="0.5"/>
      <path class="bot-arm" d="M5.0 12.2 L3.1 12.7" stroke="${darker}" stroke-width="2.3" stroke-linecap="round"/>
      <circle cx="2.7" cy="12.9" r="1.2" fill="${darker}"/>
      <path class="bot-arm" d="M19.0 12.2 L20.9 12.7" stroke="${darker}" stroke-width="2.3" stroke-linecap="round"/>
      <circle cx="21.3" cy="12.9" r="1.2" fill="${darker}"/>
      <path class="bot-leg" d="M9.6 20.0 L9.6 21.2" stroke="${darker}" stroke-width="2.2" stroke-linecap="round"/>
      <path class="bot-leg" d="M14.4 20.0 L14.4 21.2" stroke="${darker}" stroke-width="2.2" stroke-linecap="round"/>
      <path class="bot-foot" d="M8.4 21.6 L10.8 21.6" stroke="${darker}" stroke-width="2.2" stroke-linecap="round"/>
      <path class="bot-foot" d="M13.2 21.6 L15.6 21.6" stroke="${darker}" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="7.2" y1="13.3" x2="7.2" y2="14.3" stroke="${STEEL_DARK}" stroke-width="0.8" stroke-linecap="round"/>
      <line x1="7.2" y1="15.0" x2="7.2" y2="16.0" stroke="${STEEL_DARK}" stroke-width="0.8" stroke-linecap="round"/>
      <line x1="7.2" y1="16.7" x2="7.2" y2="17.7" stroke="${STEEL_DARK}" stroke-width="0.8" stroke-linecap="round"/>
      <rect x="6.6" y="6.4" width="10.8" height="5.4" rx="2.7" fill="${VISOR_DARK}" stroke="${visorEdge}" stroke-width="0.9"/>
      ${state === 'reviewing' ? `<rect class="visor-scan" x="7.6" y="8.5" width="8.8" height="0.7" rx="0.35" fill="${SCREEN_LIGHT}" opacity="0.12"/>` : ''}
      ${eyes}
      ${mouth}
      <line x1="6.3" y1="12.8" x2="17.7" y2="12.8" stroke="${lighter}" stroke-width="0.5" stroke-linecap="round" opacity="0.4"/>
      <circle cx="7.4" cy="12.8" r="0.55" fill="${lighter}" opacity="0.6"/>
      <circle cx="16.6" cy="12.8" r="0.55" fill="${lighter}" opacity="0.6"/>
      <circle cx="12" cy="15.3" r="1.9" fill="${DIAL_DARK}"/>
      <circle cx="12" cy="15.3" r="1.9" fill="none" stroke="${STEEL}" stroke-width="0.6"/>
      <line x1="12" y1="15.3" x2="12.9" y2="14.3" stroke="${lighter}" stroke-width="0.7" stroke-linecap="round"/>
      <circle cx="12" cy="15.3" r="0.5" fill="${lighter}"/>
    </svg>`;
  }

  function lightenColor(hex, pct) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + pct);
    const g = Math.min(255, ((num >> 8) & 0xff) + pct);
    const b = Math.min(255, (num & 0xff) + pct);
    return `rgb(${r},${g},${b})`;
  }

  function createBotElement(model, state, small) {
    const color = getModelColor(model);
    const el = document.createElement('div');
    el.className = 'boiler-bot' + (small ? ' bot-sm' : '');
    el.dataset.state = state || 'idle';
    el.dataset.model = model;
    el.title = `${model} — ${state || 'idle'}`;
    el.innerHTML = `
      <div class="bot-body">${createBotSVG(color, state)}</div>
      <div class="bot-badge">${model}</div>
    `;
    return el;
  }

  /* =========================================================
     STATE
     ========================================================= */
  const STORAGE_KEY = 'boilerroom_metadata';
  let state = {
    repos: [],
    metadata: {},
    filter: 'all',
    search: '',
    sortBy: 'updated',
    currentRepo: null,
    isDemo: false,
    user: null,
    terminalLines: [],
    botStates: {}
  };

  function loadMetadata() {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : {}; }
    catch { return {}; }
  }
  function saveMetadata() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.metadata)); }
  function getMeta(id) {
    if (!state.metadata[id]) state.metadata[id] = { tags: [], sessionNotes: '', aiContext: '', pinned: false };
    return state.metadata[id];
  }
  function getMetaKey(repo) { return repo.full_name || String(repo.id); }

  /* =========================================================
     AUTH
     ========================================================= */
  async function checkAuth() {
    try {
      const res = await fetch('/api/me');
      if (res.ok) { state.user = await res.json(); state.isDemo = false; return true; }
    } catch {}
    return false;
  }
  async function fetchRepos() {
    try { const res = await fetch('/api/repos'); if (!res.ok) throw 0; return await res.json(); }
    catch { return null; }
  }

  /* =========================================================
     VIEW SWITCHING
     ========================================================= */
  function showLanding() {
    document.getElementById('landing').style.display = '';
    document.getElementById('dashboard').style.display = 'none';
    renderHeaderNav();
  }
  function showDashboard() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    renderHeaderNav();
    renderBoiler();
    renderAIBay();
    renderWorkstations();
    renderTerminalInitial();
  }

  function renderHeaderNav() {
    const nav = document.getElementById('headerNav');
    if (state.user) {
      nav.innerHTML = `<div class="nav-user"><img class="nav-avatar" src="${state.user.avatar_url}" alt="${state.user.login}"><span class="nav-login">${state.user.login}</span></div><a href="/api/auth/logout" class="btn btn-sm btn-ghost">Sign out</a>`;
    } else if (state.isDemo) {
      nav.innerHTML = `<span class="demo-badge">Demo Mode</span><button class="btn btn-sm btn-ghost" onclick="exitDemo()">Exit</button>`;
    } else { nav.innerHTML = ''; }
  }

  /* =========================================================
     BOILER — System pressure gauge
     ========================================================= */
  function calcPressure() {
    const repos = state.repos;
    if (!repos.length) return 0;
    let pressure = 0;
    repos.forEach(r => {
      const meta = state.metadata[getMetaKey(r)] || {};
      const status = (meta.aiStatus || 'IDLE').toUpperCase();
      if (status === 'WORKING' || status === 'ACTIVE') pressure += 25;
      else if (status === 'REVIEWING' || status === 'REVIEW') pressure += 15;
      else if (status === 'BLOCKED') pressure += 20;
      else if (status === 'PLANNING') pressure += 10;
    });
    return Math.min(100, Math.round((pressure / Math.max(repos.length, 1)) * 100));
  }

  function renderBoiler() {
    const repos = state.repos;
    const pressure = calcPressure();
    const gauge = document.getElementById('boilerGauge');
    const fill = document.getElementById('gaugeFill');
    const val = document.getElementById('gaugeValue');

    val.textContent = pressure + '%';
    fill.style.width = pressure + '%';
    fill.className = 'gauge-fill' + (pressure > 70 ? ' high' : pressure > 40 ? ' medium' : '');
    gauge.className = 'boiler-gauge' + (pressure > 70 ? ' pressure-high' : pressure > 40 ? ' pressure-medium' : '');

    // Count statuses from metadata
    let active = 0, blocked = 0, review = 0, done = 0, pinned = 0;
    repos.forEach(r => {
      const meta = state.metadata[getMetaKey(r)] || {};
      const s = (meta.aiStatus || 'IDLE').toUpperCase();
      if (s === 'WORKING' || s === 'ACTIVE') active++;
      else if (s === 'BLOCKED') blocked++;
      else if (s === 'REVIEWING' || s === 'REVIEW') review++;
      else if (s === 'DONE' || s === 'COMPLETE') done++;
      if (meta.pinned) pinned++;
    });

    document.getElementById('statTotal').textContent = repos.length;
    document.getElementById('statActive').textContent = active;
    document.getElementById('statBlocked').textContent = blocked;
    document.getElementById('statReview').textContent = review;
    document.getElementById('statDone').textContent = done;
    document.getElementById('statPinned').textContent = pinned;
  }

  /* =========================================================
     AI BAY — Idle bots
     ========================================================= */
  function renderAIBay() {
    const bay = document.getElementById('aiBayBots');
    bay.innerHTML = '';
    // Collect unique models in use
    const models = new Set();
    state.repos.forEach(r => {
      const meta = state.metadata[getMetaKey(r)] || {};
      if (meta.aiModel) models.add(meta.aiModel);
    });
    // Also add some defaults for demo
    if (state.isDemo && models.size === 0) {
      ['Model A', 'Model B', 'Model C'].forEach(m => models.add(m));
    }
    models.forEach(model => {
      const assignedRepos = state.repos.filter(r => {
        const meta = state.metadata[getMetaKey(r)] || {};
        return meta.aiModel === model || (state.isDemo && (
          (model === 'Model A' && r.name.includes('api')) ||
          (model === 'Model B' && r.name.includes('front')) ||
          (model === 'Model C' && r.name.includes('agent'))
        ));
      });
      const busyCount = assignedRepos.filter(r => {
        const meta = state.metadata[getMetaKey(r)] || {};
        const s = (meta.aiStatus || 'IDLE').toUpperCase();
        return s === 'WORKING' || s === 'ACTIVE' || s === 'REVIEWING' || s === 'REVIEW';
      }).length;
      const botState = busyCount > 0 ? 'working' : 'idle';
      bay.appendChild(createBotElement(model, botState, false));
    });
    // If no models at all, show a default idle bot
    if (bay.children.length === 0) {
      bay.appendChild(createBotElement('System', 'idle', false));
    }
  }

  /* =========================================================
     WORKSTATIONS — Repo cards
     ========================================================= */
  function renderWorkstations() {
    const floor = document.getElementById('workstationFloor');
    const empty = document.getElementById('emptyState');
    let repos = [...state.repos];

    // Search
    if (state.search) {
      const q = state.search.toLowerCase();
      repos = repos.filter(r => {
        const m = getMetaKey(r);
        const meta = state.metadata[m] || {};
        return r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q) || (r.language || '').toLowerCase().includes(q) || (meta.tags || []).some(t => t.toLowerCase().includes(q)) || (meta.sessionNotes || '').toLowerCase().includes(q) || (meta.aiContext || '').toLowerCase().includes(q);
      });
    }

    // Filter
    if (state.filter === 'pinned') repos = repos.filter(r => { const m = state.metadata[getMetaKey(r)]; return m && m.pinned; });
    else if (state.filter === 'annotated') repos = repos.filter(r => { const m = state.metadata[getMetaKey(r)]; return m && (m.tags.length > 0 || m.aiContext || m.sessionNotes); });

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

    if (repos.length === 0) { floor.innerHTML = ''; empty.style.display = ''; return; }
    empty.style.display = 'none';

    floor.innerHTML = repos.map(r => {
      const key = getMetaKey(r);
      const meta = state.metadata[key] || {};
      const status = (meta.aiStatus || 'IDLE').toUpperCase();
      const model = meta.aiModel || '';
      const ctx = meta.contextPct != null ? meta.contextPct : null;
      const ctxClass = ctx != null ? (ctx > 80 ? 'critical' : ctx > 50 ? 'warning' : 'normal') : '';
      const ctxWidth = ctx != null ? ctx : 0;
      const tags = (meta.tags || []).slice(0, 3);
      const ago = timeAgo(r.pushed_at);

      return `<div class="workstation" onclick="openModal('${escHtml(r.full_name)}')" tabindex="0" role="button" aria-label="Open ${escHtml(r.name)}">
        <div class="workstation-status s-${status === 'ACTIVE' || status === 'WORKING' ? 'ACTIVE' : status === 'BLOCKED' ? 'BLOCKED' : status === 'REVIEW' || status === 'REVIEWING' ? 'REVIEW' : status === 'DONE' || status === 'COMPLETE' ? 'DONE' : ''}"></div>
        <div class="workstation-body">
          <div class="workstation-header">
            <span class="workstation-name">${escHtml(r.name)}</span>
            <div class="workstation-badges">
              ${r.private ? '<span class="badge badge-private">Private</span>' : ''}
              ${meta.pinned ? '<span class="badge badge-pinned">Pinned</span>' : ''}
              ${model ? `<span class="badge" style="color:${getModelColor(model)};border-color:${getModelColor(model)};background:${getModelColor(model)}22">${escHtml(model)}</span>` : ''}
            </div>
          </div>
          <div class="workstation-desc">${escHtml(r.description || 'No description')}</div>
          ${ctx != null ? `<div class="workstation-context"><div class="ctx-bar"><div class="ctx-fill ${ctxClass}" style="width:${ctxWidth}%"></div></div><span class="ctx-text ${ctxClass}">${ctx}%</span></div>` : ''}
          <div class="workstation-meta">
            ${r.language ? `<span class="lang"><span class="lang-dot" style="background:${langColor(r.language)}"></span>${escHtml(r.language)}</span>` : ''}
            <span>⭐ ${r.stargazers_count}</span>
            <span>${ago}</span>
          </div>
          ${tags.length > 0 ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:2px">${tags.map(t => `<span class="badge badge-status" style="color:var(--text-muted);border-color:var(--border)">${escHtml(t)}</span>`).join('')}</div>` : ''}
        </div>
        ${model ? `<div class="workstation-bot">${createBotElement(model, status === 'WORKING' || status === 'ACTIVE' ? 'working' : status === 'REVIEWING' || status === 'REVIEW' ? 'reviewing' : status === 'BLOCKED' ? 'blocked' : status === 'DONE' || status === 'COMPLETE' ? 'complete' : 'idle', true).outerHTML}</div>` : ''}
      </div>`;
    }).join('');
  }

  /* =========================================================
     ACTIVITY TERMINAL
     ========================================================= */
  function renderTerminalInitial() {
    const feed = document.getElementById('terminalFeed');
    feed.innerHTML = '';
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);

    addTerminalLine(time, 'SYSTEM', 'Boiler Room online', 'ONLINE');

    state.repos.forEach(r => {
      const meta = state.metadata[getMetaKey(r)] || {};
      const model = meta.aiModel || 'System';
      const status = (meta.aiStatus || 'IDLE').toUpperCase();
      addTerminalLine(time, model, r.name, status);
    });
  }

  function addTerminalLine(time, bot, repo, status) {
    const feed = document.getElementById('terminalFeed');
    if (!feed) return;
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="term-time">${escHtml(time)}</span><span class="term-bot">${escHtml(bot)}</span><span class="term-repo">${escHtml(repo)}</span><span class="term-status" data-status="${escHtml(status)}">${escHtml(status)}</span>`;
    feed.insertBefore(line, feed.firstChild);
    // Keep max 30 lines
    while (feed.children.length > 30) feed.removeChild(feed.lastChild);
  }

  /* =========================================================
     MODAL
     ========================================================= */
  window.openModal = function(fullName) {
    const repo = state.repos.find(r => r.full_name === fullName || String(r.id) === fullName);
    if (!repo) return;
    state.currentRepo = repo;
    const key = getMetaKey(repo);
    const meta = getMeta(key);

    document.getElementById('modalTitle').textContent = repo.name;
    document.getElementById('modalSubtitle').textContent = repo.full_name;
    document.getElementById('modalBadges').innerHTML = `${repo.private ? '<span class="badge badge-private">Private</span>' : ''}${meta.pinned ? '<span class="badge badge-pinned">Pinned</span>' : ''}`;

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
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelector('.tab[data-tab="metadata"]').classList.add('active');
    document.getElementById('tabMetadata').classList.add('active');
  };

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function closeModal() { document.getElementById('modalOverlay').style.display = 'none'; state.currentRepo = null; }

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.tab-content[data-tab="${tab.dataset.tab}"]`).classList.add('active');
    });
  });

  window.saveMetadata = function() {
    if (!state.currentRepo) return;
    const key = getMetaKey(state.currentRepo);
    const tags = document.getElementById('editTags').value.split(',').map(t => t.trim()).filter(Boolean);
    state.metadata[key] = {
      tags,
      sessionNotes: document.getElementById('editSession').value,
      aiContext: document.getElementById('editContext').value,
      pinned: document.getElementById('editPinned').checked,
      aiModel: state.metadata[key]?.aiModel || '',
      aiStatus: state.metadata[key]?.aiStatus || '',
      contextPct: state.metadata[key]?.contextPct ?? null
    };
    saveMetadata();
    renderBoiler();
    renderAIBay();
    renderWorkstations();
    showToast('Metadata saved');
  };

  /* =========================================================
     PROMPTS
     ========================================================= */
  function generatePrompts(repo, meta) {
    const ctx = `Repo: ${repo.full_name}\nDescription: ${repo.description || 'N/A'}\nLanguage: ${repo.language || 'N/A'}\nBranch: ${repo.default_branch}\nTags: ${(meta.tags || []).join(', ') || 'none'}\nAI Context: ${meta.aiContext || 'none'}`;
    document.getElementById('promptContextText').textContent = ctx;
    const resume = meta.sessionNotes
      ? `Resume session for ${repo.full_name}.\nLast session notes:\n${meta.sessionNotes}\n\nContinue from where we left off.`
      : `Start a new session for ${repo.full_name}. No previous session notes found.`;
    document.getElementById('promptResumeText').textContent = resume;
  }

  window.copyPrompt = function(type) {
    const el = type === 'context' ? document.getElementById('promptContextText') : document.getElementById('promptResumeText');
    navigator.clipboard.writeText(el.textContent).then(() => showToast('Copied to clipboard'));
  };

  /* =========================================================
     IMPORT / EXPORT / RESET
     ========================================================= */
  window.importData = function() { document.getElementById('importInput').click(); };
  document.getElementById('importInput').addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target.result);
        state.metadata = imported.metadata || imported;
        saveMetadata();
        renderBoiler(); renderAIBay(); renderWorkstations();
        showToast('Data imported');
      } catch { showToast('Invalid JSON'); }
    };
    reader.readAsText(file); e.target.value = '';
  });

  window.exportData = function() {
    const data = { metadata: state.metadata, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `boilerroom-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url); showToast('Data exported');
  };

  window.resetData = function() {
    if (confirm('Reset all local metadata? This cannot be undone.')) {
      state.metadata = {}; saveMetadata();
      renderBoiler(); renderAIBay(); renderWorkstations();
      showToast('Metadata reset');
    }
  };

  /* =========================================================
     SEARCH & FILTER
     ========================================================= */
  document.getElementById('searchInput').addEventListener('input', e => { state.search = e.target.value; renderWorkstations(); });
  document.getElementById('sortBy').addEventListener('change', e => { state.sortBy = e.target.value; renderWorkstations(); });
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.filter = chip.dataset.filter;
      renderWorkstations();
    });
  });

  /* =========================================================
     TOAST
     ========================================================= */
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast'; toast.textContent = msg;
    document.getElementById('toastContainer').appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2000);
  }

  /* =========================================================
     HELPERS
     ========================================================= */
  function escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function timeAgo(dateStr) {
    const secs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (secs < 60) return 'just now';
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }
  function langColor(lang) {
    const c = { TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5', HTML: '#e34c26', CSS: '#563d7c', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516', Java: '#b07219' };
    return c[lang] || '#8b8b8b';
  }

  /* =========================================================
     DEMO MODE
     ========================================================= */
  window.enterDemo = function() {
    state.isDemo = true;
    state.repos = SEED_DATA;
    // Assign demo AI statuses for visual interest
    const demoAssign = [
      { status: 'WORKING', model: 'Model A', ctx: 42 },
      { status: 'BLOCKED', model: 'Model B', ctx: 78 },
      { status: 'REVIEWING', model: 'Model C', ctx: 15 },
      { status: 'DONE', model: 'Model A', ctx: 100 }
    ];
    SEED_DATA.forEach((r, i) => {
      const key = getMetaKey(r);
      if (!state.metadata[key]) state.metadata[key] = { tags: [], sessionNotes: '', aiContext: '', pinned: false };
      const d = demoAssign[i] || demoAssign[0];
      state.metadata[key].aiStatus = d.status;
      state.metadata[key].aiModel = d.model;
      state.metadata[key].contextPct = d.ctx;
    });
    showDashboard();
  };

  window.exitDemo = function() {
    state.isDemo = false; state.user = null; state.repos = [];
    showLanding();
  };

  /* =========================================================
     KEYBOARD
     ========================================================= */
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList.contains('workstation')) e.target.click();
  });

  /* =========================================================
     INIT
     ========================================================= */
  async function init() {
    state.metadata = loadMetadata();
    const isAuthed = await checkAuth();
    if (isAuthed) {
      document.getElementById('loadingState').style.display = '';
      const repos = await fetchRepos();
      document.getElementById('loadingState').style.display = 'none';
      if (repos) { state.repos = repos; showDashboard(); }
      else { showLanding(); }
    } else { showLanding(); }
  }

  init();
})();
