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
    'OpenCode': '#4a9eff',
    'Codex': '#34d058',
    'Claude': '#e3b341',
    'Gemini': '#a78bfa',
    'MiMo': '#56d4dd',
    'GPT': '#34d058',
    'Local': '#8b98a8',
  };

  const MODEL_COLOR_RULES = [
    [/claude|sonnet|opus|haiku/i, '#e3b341'],
    [/codex|gpt|openai/i, '#34d058'],
    [/gemini/i, '#a78bfa'],
    [/mimo/i, '#56d4dd'],
    [/local/i, '#8b98a8'],
    [/opencode/i, '#4a9eff'],
  ];

  function getModelColor(model) {
    if (!model) return '#6b7a90';
    if (MODEL_COLORS[model]) return MODEL_COLORS[model];
    for (const [re, color] of MODEL_COLOR_RULES) {
      if (re.test(model)) return color;
    }
    return '#6b7a90';
  }

  function compactModel(model) {
    return String(model || 'OpenCode');
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
  let workloadTimer = null;
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
    botStates: {},
    sessions: [],
    workloadStore: '',
    workloadOnline: true,
    lastSnapshot: null
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
    if (state.user && !state.isDemo) startWorkloadPolling();
  }

  function startWorkloadPolling() {
    if (workloadTimer) clearInterval(workloadTimer);
    fetchWorkload();
    workloadTimer = setInterval(fetchWorkload, 5000);
  }

  async function fetchWorkload() {
    if (!state.user || state.isDemo) return;
    try {
      const res = await fetch('/api/workload', { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      applyWorkload(data);
    } catch {
      state.workloadOnline = false;
      updateLivePill();
    }
  }

  function applyWorkload(data) {
    state.workloadOnline = true;
    state.workloadStore = data.store || '';
    const prev = state.sessions;
    state.sessions = (data.sessions || []);
    state.lastSnapshot = data;
    updateLivePill();
    diffSessions(prev, state.sessions);
    renderBoiler();
    renderAIBay();
    renderWorkstations();
  }

  function updateLivePill() {
    const pill = document.getElementById('livePill');
    if (!pill) return;
    const live = state.workloadOnline && state.sessions.some(s => s.status !== 'STALE');
    pill.classList.toggle('disconnected', !state.workloadOnline);
    pill.classList.toggle('memory', state.workloadStore === 'memory');
    pill.classList.toggle('idle', !live && state.workloadOnline);
    pill.title = state.workloadStore === 'memory'
      ? 'Workload store degraded (in-memory). Attach Vercel KV for persistence.'
      : `Live workload · ${state.sessions.length} session(s) · store: ${state.workloadStore}`;
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
    if (isLiveMode()) {
      const c = liveCounters();
      const pts = c.ACTIVE * 30 + c.REVIEW * 16 + c.BLOCKED * 22 + c.ERROR * 20;
      if (c.TOTAL === 0) return 0;
      return Math.min(100, Math.round(pts / c.TOTAL));
    }
    const repos = state.repos;
    if (!repos.length) return 0;
    let pressure = 0;
    repos.forEach(r => {
      const meta = state.metadata[getMetaKey(r)] || {};
      const status = (meta.aiStatus || 'IDLE').toUpperCase();
      if (status === 'WORKING' || status === 'ACTIVE') pressure += 25;
      else if (status === 'REVIEWING' || status === 'REVIEW') pressure += 15;
      else if (status === 'BLOCKED' || status === 'ERROR') pressure += 20;
      else if (status === 'PLANNING') pressure += 10;
    });
    return Math.min(100, Math.round((pressure / Math.max(repos.length, 1)) * 100));
  }

  function isLiveMode() {
    return !!state.user && !state.isDemo;
  }

  function liveCounters() {
    const c = { ACTIVE: 0, REVIEW: 0, BLOCKED: 0, ERROR: 0, DONE: 0, IDLE: 0, TOTAL: 0 };
    state.sessions.forEach(s => {
      if (s.status === 'STALE') return;
      if (c[s.status] != null) c[s.status]++;
      c.TOTAL++;
    });
    return c;
  }

  function renderBoiler() {
    const pressure = calcPressure();
    const gauge = document.getElementById('boilerGauge');
    const fill = document.getElementById('gaugeFill');
    const val = document.getElementById('gaugeValue');

    val.textContent = pressure + '%';
    fill.style.width = pressure + '%';
    fill.className = 'gauge-fill' + (pressure > 70 ? ' high' : pressure > 40 ? ' medium' : '');
    gauge.className = 'boiler-gauge' + (pressure > 70 ? ' pressure-high' : pressure > 40 ? ' pressure-medium' : '');

    if (isLiveMode()) {
      const c = liveCounters();
      document.getElementById('statTotal').textContent = c.TOTAL;
      document.getElementById('statActive').textContent = c.ACTIVE;
      document.getElementById('statBlocked').textContent = c.BLOCKED + c.ERROR;
      document.getElementById('statReview').textContent = c.REVIEW;
      document.getElementById('statDone').textContent = c.DONE + c.IDLE;
      const pinned = state.repos.filter(r => (state.metadata[getMetaKey(r)] || {}).pinned).length;
      document.getElementById('statPinned').textContent = pinned;
      return;
    }

    // Count statuses from metadata
    const repos = state.repos;
    let active = 0, blocked = 0, review = 0, done = 0, pinned = 0;
    repos.forEach(r => {
      const meta = state.metadata[getMetaKey(r)] || {};
      const s = (meta.aiStatus || 'IDLE').toUpperCase();
      if (s === 'WORKING' || s === 'ACTIVE') active++;
      else if (s === 'BLOCKED' || s === 'ERROR') blocked++;
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

    if (isLiveMode()) {
      const count = state.sessions.length;
      if (!count) {
        bay.appendChild(createBotElement('OpenCode', 'idle', false));
      } else {
        state.sessions.forEach(s => {
          if (s.status === 'STALE') return;
          const model = compactModel(s.model);
          const bot = createBotElement(model, faceStateForStatus(s.status), false);
          bot.title = `${model} — ${s.status} · ${s.repo || s.project || 'no repo'} · ${s.lastActivity || ''}`;
          bay.appendChild(bot);
        });
      }
      return;
    }

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
        return s === 'WORKING' || s === 'ACTIVE' || s === 'REVIEWING' || s === 'REVIEW' || s === 'ERROR';
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
     WORKSTATIONS — Repo rooms (living dioramas)
     ========================================================= */
  const WRENCH_SVG = `<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="1.4" y="3.6" width="3.2" height="5.2" rx="1.3" fill="#39465c"/><rect x="4.7" y="6.2" width="5.2" height="1.7" rx="0.8" fill="#c8a94e" transform="rotate(-18 7.3 7.05)"/></svg>`;
  const ICON_SVG = {
    leak: `<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.6c0 0 3.3 3.7 3.3 5.9A3.3 3.3 0 1 1 2.7 7.5C2.7 5.3 6 1.6 6 1.6z" fill="#56d4dd"/><path d="M6 8.3a1.9 1.9 0 0 1-1.9 1.9" stroke="#0a0e16" stroke-width="0.9" fill="none"/></svg>`,
    server: `<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="2" width="8" height="8" rx="1.2" fill="#39465c"/><circle cx="4" cy="4" r="0.9" fill="#0a0e16"/><path d="M5.6 3.8H9M4.4 6H9M4.4 7.9H9" stroke="#0a0e16" stroke-width="0.9"/></svg>`,
    spark: `<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6.2 1L3 6.4h3l-.9 4.6 3.6-6H5.6z" fill="#e3b341"/></svg>`,
    clipboard: `<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.4" y="2" width="7.2" height="9" rx="1.2" fill="#39465c"/><rect x="4.2" y="0.9" width="3.6" height="2" rx="0.6" fill="#161c25"/><path d="M4 5h4M4 6.9h3" stroke="#0a0e16" stroke-width="0.9"/></svg>`,
  };
  const PLABEL = { leak: 'PIPE LEAK', server: 'SERVER ALERT', spark: 'JUNCTION SHORT', clipboard: 'REVIEW REQ' };
  const PROBLEM_SPEC = { leak: { pos: 'left' }, server: { pos: 'right' }, spark: { pos: 'left' }, clipboard: { pos: 'review' } };
  const PROBLEM_KINDS = ['leak', 'server', 'spark', 'clipboard'];

  const RMOTION = (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const TRAVEL_MS = RMOTION ? 120 : 950;

  function roomPlan(status, idx) {
    const kind = PROBLEM_KINDS[idx % PROBLEM_KINDS.length];
    switch (status) {
      case 'WORKING': case 'ACTIVE':
        return { state: 'working', pos: PROBLEM_SPEC[kind].pos, problem: kind, light: 'busy', tool: true };
      case 'REVIEWING': case 'REVIEW':
        return { state: 'reviewing', pos: 'review', problem: '', light: 'busy', tablet: true };
      case 'BLOCKED':
        return { state: 'blocked', pos: PROBLEM_SPEC[kind].pos, problem: kind, light: 'busy' };
      case 'ERROR':
        return { state: 'error', pos: PROBLEM_SPEC[kind].pos, problem: kind, light: 'err' };
      case 'DONE': case 'COMPLETE':
        return { state: 'complete', pos: 'desk', problem: '', light: 'ok', monitorDone: true };
      default:
        return { state: 'idle', pos: 'desk', problem: '', light: 'ok' };
    }
  }

  function buildRoomHTML(r, model, plan, color) {
    return `<div class="room${plan.monitorDone ? ' room-monitor-done' : ''}${plan.problem ? ' dmg-' + plan.problem : ''}" data-repo="${escHtml(r.name)}">
      <div class="room-wall"></div>
      <div class="room-pipes left"></div>
      <div class="room-pipes right"></div>
      <div class="room-pipe-run"><span class="run-drip"></span></div>
      <div class="room-valve"></div>
      <div class="room-gauge"><span class="gauge-needle"></span><span class="gauge-hub"></span></div>
      <div class="room-tank"><span class="tank-steam"></span></div>
      <div class="room-cabinet"></div>
      <div class="room-shelf"><div class="shelf-box"></div></div>
      <div class="room-junction"></div>
      <div class="room-server"><span class="server-dot"></span></div>
      <div class="room-floor"></div>
      <div class="room-desk">
        <div class="desk-top"></div>
        <div class="desk-leg l1"></div>
        <div class="desk-leg l2"></div>
        <div class="desk-mug"></div>
        <div class="desk-monitor">
          <div class="monitor-screen"></div>
          <div class="monitor-stand"></div>
          <div class="monitor-base"></div>
          <svg class="done-check" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.2 L4.8 9 L10 3" fill="none" stroke="#34d058" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
      <div class="room-chair">
        <div class="chair-back"></div>
        <div class="chair-seat"></div>
        <div class="chair-post"></div>
        <div class="chair-base"></div>
      </div>
      <div class="room-light st-${plan.light}"></div>
      ${plan.problem ? `<div class="room-problem p-${plan.problem}"><span class="p-icon">${ICON_SVG[plan.problem]}</span><span class="p-label">${PLABEL[plan.problem]}</span></div>` : ''}
      ${model ? `<div class="room-bot rpos-${plan.pos}">
        <div class="boiler-bot" data-state="${plan.state}" data-model="${model}" title="${escHtml(model)} — ${plan.state}">
          <div class="bot-body">${createBotSVG(color, plan.state)}</div>
          <div class="bot-badge">${escHtml(model)}</div>
          <div class="room-tool">${WRENCH_SVG}</div>
          <div class="room-tablet"><span></span><span></span><span></span></div>
        </div>
      </div>` : ''}
    </div>`;
  }

  function renderWorkstations() {
    const floor = document.getElementById('workstationFloor');
    const empty = document.getElementById('emptyState');
    if (isLiveMode()) return renderLiveWorkstations();
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

    floor.innerHTML = repos.map((r, i) => {
      const key = getMetaKey(r);
      const meta = state.metadata[key] || {};
      const status = (meta.aiStatus || 'IDLE').toUpperCase();
      const model = meta.aiModel || '';
      const color = model ? getModelColor(model) : null;
      const ctx = meta.contextPct != null ? meta.contextPct : null;
      const ctxClass = ctx != null ? (ctx > 80 ? 'critical' : ctx > 50 ? 'warning' : 'normal') : '';
      const ctxWidth = ctx != null ? ctx : 0;
      const tags = (meta.tags || []).slice(0, 3);
      const ago = timeAgo(r.pushed_at);
      const statusSlug = status === 'ACTIVE' || status === 'WORKING' ? 'ACTIVE' : status === 'BLOCKED' ? 'BLOCKED' : status === 'REVIEW' || status === 'REVIEWING' ? 'REVIEW' : status === 'DONE' || status === 'COMPLETE' ? 'DONE' : '';

      return `<div class="workstation" data-key="${escHtml(key)}" onclick="openModal('${escHtml(r.full_name)}')" tabindex="0" role="button" aria-label="Open ${escHtml(r.name)}">
        <div class="workstation-status s-${statusSlug}"></div>
        ${buildRoomHTML(r, model, roomPlan(status, i), color)}
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
      </div>`;
    }).join('');

    bindRooms();
  }

  /* =========================================================
     ROOM LIFECYCLE — Demo Mode living rooms
     ========================================================= */
  const roomCtl = new Map();
  const randMs = max => Math.floor(Math.random() * max);

  function schedule(ctl, ms, fn) {
    if (ctl.timer) clearTimeout(ctl.timer);
    ctl.timer = setTimeout(() => { ctl.timer = null; fn(); }, ms);
  }

  function roomVisFromMeta(repo) {
    const meta = state.metadata[getMetaKey(repo)] || {};
    const status = (meta.aiStatus || 'IDLE').toUpperCase();
    const kind = PROBLEM_KINDS[getMetaKey(repo).length % PROBLEM_KINDS.length];
    const spec = PROBLEM_SPEC[kind];
    switch (status) {
      case 'WORKING': case 'ACTIVE':
        return { state: 'working', pos: spec.pos, problem: kind, light: 'busy', tool: true, tablet: false, monitorDone: false, moving: false };
      case 'REVIEWING': case 'REVIEW':
        return { state: 'reviewing', pos: 'review', problem: '', light: 'busy', tool: false, tablet: true, monitorDone: false, moving: false };
      case 'BLOCKED':
        return { state: 'blocked', pos: spec.pos, problem: kind, light: 'busy', tool: false, tablet: false, monitorDone: false, moving: false };
      case 'ERROR':
        return { state: 'error', pos: spec.pos, problem: kind, light: 'err', tool: false, tablet: false, monitorDone: false, moving: false };
      case 'DONE': case 'COMPLETE':
        return { state: 'complete', pos: 'desk', problem: '', light: 'ok', tool: false, tablet: false, monitorDone: true, moving: false };
      default:
        return { state: 'idle', pos: 'desk', problem: '', light: 'ok', tool: false, tablet: false, monitorDone: false, moving: false };
    }
  }

  function bindRooms() {
    if (!state.isDemo) return;
    document.querySelectorAll('#workstationFloor .workstation').forEach(ws => {
      const key = ws.getAttribute('data-key');
      if (!key || !ws.querySelector('.room-bot .boiler-bot')) return;
      const repo = state.repos.find(r => getMetaKey(r) === key);
      if (!repo) return;
      let ctl = roomCtl.get(key);
      if (!ctl) {
        ctl = { key, repo, timer: null, armed: false, job: false, ref: null, vis: roomVisFromMeta(repo) };
        roomCtl.set(key, ctl);
      }
      attachRoomRefs(ctl, ws);
      applyVis(ctl);
      if (!ctl.armed) { ctl.armed = true; armRoom(ctl); }
    });
  }

  function attachRoomRefs(ctl, ws) {
    const roomEl = ws.querySelector('.room');
    ctl.ref = {
      roomEl,
      bot: roomEl.querySelector('.room-bot .boiler-bot'),
      roomBot: roomEl.querySelector('.room-bot'),
      light: roomEl.querySelector('.room-light'),
      problem: roomEl.querySelector('.room-problem'),
      tool: roomEl.querySelector('.room-tool'),
      tablet: roomEl.querySelector('.room-tablet')
    };
  }

  function applyVis(ctl) {
    const vis = ctl.vis;
    const ref = ctl.ref;
    if (!ref.roomEl || !ref.bot) return;
    setBotFace(ref.bot, vis.state);
    ref.roomBot.classList.remove('rpos-desk', 'rpos-left', 'rpos-right', 'rpos-review', 'rpos-center');
    ref.roomBot.classList.add('rpos-' + vis.pos);
    if (vis.moving) ref.roomBot.setAttribute('data-walking', '');
    else ref.roomBot.removeAttribute('data-walking');
    ref.light.className = 'room-light st-' + vis.light;
    if (vis.problem) {
      if (ref.problem) { ref.problem.className = 'room-problem p-' + vis.problem; ref.problem.style.display = ''; }
    } else if (ref.problem) ref.problem.style.display = 'none';
    ref.tool.classList.toggle('on', !!vis.tool);
    ref.tablet.classList.toggle('on', !!vis.tablet && vis.state === 'reviewing');
    ref.roomEl.classList.toggle('room-monitor-done', !!vis.monitorDone);
    ref.roomEl.classList.toggle('room-settled', vis.state === 'complete');
    ref.roomEl.classList.toggle('room-busy', vis.state === 'working' || vis.state === 'reviewing');
    ref.roomEl.classList.remove('dmg-leak', 'dmg-spark', 'dmg-server', 'dmg-clipboard');
    if (vis.problem && vis.problem !== 'clipboard') ref.roomEl.classList.add('dmg-' + vis.problem);
  }

  function setBotFace(bot, state) {
    if (bot.dataset.state === state) return;
    const color = getModelColor(bot.dataset.model);
    bot.dataset.state = state;
    bot.title = `${bot.dataset.model} — ${state}`;
    const face = bot.querySelector('.bot-body');
    face.innerHTML = createBotSVG(color, state);
  }

  function stage(ctl, patch) {
    Object.assign(ctl.vis, patch);
    applyVis(ctl);
  }

  function armRoom(ctl) {
    const status = (state.metadata[getMetaKey(ctl.repo)] || {}).aiStatus || 'IDLE';
    const s = status.toUpperCase();
    if (s === 'WORKING' || s === 'ACTIVE') { ctl.job = true; schedule(ctl, 5000 + randMs(2500), () => toReview(ctl)); }
    else if (s === 'REVIEWING' || s === 'REVIEW') { ctl.job = true; schedule(ctl, 4000 + randMs(2000), () => resolve(ctl)); }
    else if (s === 'BLOCKED') { ctl.job = true; schedule(ctl, 9000 + randMs(7000), () => resolve(ctl)); }
    else if (s === 'DONE' || s === 'COMPLETE') { schedule(ctl, 8000 + randMs(8000), () => beginJob(ctl)); }
    else { schedule(ctl, 6000 + randMs(9000), () => beginJob(ctl)); }
  }

  function beginJob(ctl) {
    if (!state.isDemo || ctl.job) return;
    ctl.job = true;
    const kind = PROBLEM_KINDS[Math.floor(Math.random() * PROBLEM_KINDS.length)];
    const spec = PROBLEM_SPEC[kind];
    const model = (state.metadata[getMetaKey(ctl.repo)] || {}).aiModel || 'Worker';
    setMetaStatus(ctl, 'WORKING');
    term(ctl.repo.name, model, 'maintenance task received', 'WORKING');
    stage(ctl, { problem: kind, light: 'busy' });
    schedule(ctl, (RMOTION ? 120 : 900) + randMs(600), () => {
      setBotFace(ctl.ref.bot, 'reviewing');
      schedule(ctl, RMOTION ? 120 : 700, () => {
        stage(ctl, { state: 'idle', pos: spec.pos, moving: true, tool: false, tablet: false });
        schedule(ctl, TRAVEL_MS, () => {
          stage(ctl, { moving: false, state: 'working', tool: true });
          schedule(ctl, (RMOTION ? 600 : 4500) + randMs(RMOTION ? 400 : 3500), () => toReview(ctl));
        });
      });
    });
  }

  function toReview(ctl) {
    stage(ctl, { tool: false, state: 'idle' });
    stage(ctl, { pos: 'review', moving: true });
    schedule(ctl, TRAVEL_MS, () => {
      stage(ctl, { moving: false, state: 'reviewing', tablet: true });
      schedule(ctl, (RMOTION ? 500 : 3500) + randMs(RMOTION ? 300 : 2500), () => resolve(ctl));
    });
  }

  function resolve(ctl) {
    const r = Math.random();
    if (r < 0.6) return finishComplete(ctl);
    if (r < 0.88) return blockJob(ctl);
    return errJob(ctl);
  }

  function blockJob(ctl) {
    setMetaStatus(ctl, 'BLOCKED');
    term(ctl.repo.name, (state.metadata[getMetaKey(ctl.repo)] || {}).aiModel || 'Worker', 'blocked — needs attention', 'BLOCKED');
    stage(ctl, { tablet: false, state: 'blocked' });
    schedule(ctl, (RMOTION ? 900 : 8000) + randMs(7000), () => finishComplete(ctl));
  }

  function errJob(ctl) {
    setMetaStatus(ctl, 'ERROR');
    term(ctl.repo.name, (state.metadata[getMetaKey(ctl.repo)] || {}).aiModel || 'Worker', 'error — clearing fault', 'BLOCKED');
    stage(ctl, { tablet: false, state: 'error', light: 'err' });
    schedule(ctl, (RMOTION ? 800 : 6000) + randMs(5000), () => finishComplete(ctl));
  }

  function finishComplete(ctl) {
    setMetaStatus(ctl, 'DONE');
    term(ctl.repo.name, (state.metadata[getMetaKey(ctl.repo)] || {}).aiModel || 'Worker', 'task complete', 'DONE');
    stage(ctl, { problem: '', light: 'ok', tablet: false, tool: false, state: 'idle' });
    stage(ctl, { pos: 'desk', moving: true });
    schedule(ctl, TRAVEL_MS, () => {
      stage(ctl, { moving: false, state: 'complete', monitorDone: true });
      ctl.job = false;
      schedule(ctl, 9000 + randMs(16000), () => beginJob(ctl));
    });
  }

  function setMetaStatus(ctl, status) {
    if (!state.isDemo) return;
    const meta = state.metadata[getMetaKey(ctl.repo)];
    if (meta) meta.aiStatus = status;
    renderBoiler();
    renderAIBay();
  }

  function term(repo, bot, msg, status) {
    const time = new Date().toTimeString().slice(0, 5);
    addTerminalLine(time, bot, repo, status);
  }

  function clearRoomRuntime() {
    roomCtl.forEach(c => { if (c.timer) clearTimeout(c.timer); });
    roomCtl.clear();
  }

  /* =========================================================
     LIVE WORKLOAD — Real AI sessions from the workload API
     Adapter-agnostic: sessions carry {agent,model,repo,status,...}
     and can arrive from OpenCode today, Codex/Claude later.
     ========================================================= */
  function faceStateForStatus(status) {
    switch (status) {
      case 'ACTIVE': return 'working';
      case 'REVIEW': return 'reviewing';
      case 'BLOCKED': return 'blocked';
      case 'ERROR': return 'error';
      case 'DONE': return 'complete';
      case 'STALE': return 'idle';
      default: return 'idle';
    }
  }

  function sessionStatusSlug(status) {
    if (status === 'ERROR') return 'BLOCKED';
    if (status === 'STALE') return 'DONE';
    if (status === 'ACTIVE' || status === 'REVIEW' || status === 'BLOCKED' || status === 'DONE' || status === 'IDLE') return status;
    return '';
  }

  function sessionRoomVis(session, idx) {
    const kind = PROBLEM_KINDS[idx % PROBLEM_KINDS.length];
    const spec = PROBLEM_SPEC[kind];
    switch (session.status) {
      case 'ACTIVE':
        return { state: 'working', pos: spec.pos, problem: kind, light: 'busy', tool: true, tablet: false, monitorDone: false };
      case 'REVIEW':
        return { state: 'reviewing', pos: 'review', problem: '', light: 'busy', tool: false, tablet: true, monitorDone: false };
      case 'BLOCKED':
        return { state: 'blocked', pos: spec.pos, problem: kind, light: 'busy', tool: false, tablet: false, monitorDone: false };
      case 'ERROR':
        return { state: 'error', pos: spec.pos, problem: kind, light: 'err', tool: false, tablet: false, monitorDone: false };
      case 'DONE':
        return { state: 'complete', pos: 'desk', problem: '', light: 'ok', tool: false, tablet: false, monitorDone: true };
      default:
        return { state: 'idle', pos: 'desk', problem: '', light: 'ok', tool: false, tablet: false, monitorDone: false };
    }
  }

  function sessionLabel(session) {
    if (session.title) return session.title;
    return session.repo || session.project || `session-${String(session.sessionID).slice(0, 6)}`;
  }

  function sessionMetaRow(session) {
    const t = new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `<span class="lang"><span class="lang-dot" style="background:${getModelColor(session.model)}"></span>${escHtml(compactModel(session.model))}</span><span>↥ ${t}</span><span>${escHtml(shortStr(session.directory, 28))}</span>`;
  }

  function renderLiveWorkstations() {
    const floor = document.getElementById('workstationFloor');
    const empty = document.getElementById('emptyState');
    const sessions = state.sessions;

    const live = sessions.filter(s => s.status !== 'STALE');

    if (live.length === 0) {
      floor.innerHTML = '';
      empty.style.display = '';
      const t = empty.querySelector('h3');
      const p = empty.querySelector('p');
      if (t) t.textContent = 'No live sessions';
      if (p) p.textContent = 'Open up an OpenCode session on this machine and give it work. Sessions appear here automatically.';
      return;
    }
    empty.style.display = 'none';

    floor.innerHTML = live.map((session, i) => {
      const status = session.status || 'IDLE';
      const slug = sessionStatusSlug(status);
      const model = compactModel(session.model);
      const color = getModelColor(session.model);
      const label = sessionLabel(session);
      const repos = state.repos.filter(r => r.full_name === session.repo);
      const pr = repos[0] || { name: session.repo || session.project || 'workspace', private: false, description: session.lastActivity || 'Live AI session', language: '', html_url: '', stargazers_count: 0, pushed_at: new Date(session.lastSeen).toISOString() };
      const room = roomPlan(slug, i);
      const ago = timeAgo(new Date(session.lastSeen).toISOString());

      return `<div class="workstation live-ws" data-session="${escHtml(session.sessionID)}" tabindex="0" role="button" aria-label="${escHtml(model)} — ${escHtml(status)}">
        <div class="workstation-status s-${slug}"></div>
        ${buildRoomHTML(pr, model, room, color)}
        <div class="workstation-body">
          <div class="workstation-header">
            <span class="workstation-name">${escHtml(label)}</span>
            <div class="workstation-badges">
              <span class="badge badge-${slug}">${escHtml(session.agent || 'OpenCode')}</span>
              <span class="badge badge-${status}">${escHtml(status)}</span>
            </div>
          </div>
          <div class="workstation-desc">${escHtml(session.lastActivity || 'Idle')}</div>
          <div class="workstation-meta">${sessionMetaRow(session)}</div>
          <div class="workstation-meta">
            <span>${pr.name ? escHtml(pr.name) : 'no repo'}</span>
            <span>❤ ${ago}</span>
            ${session.error ? `<span class="ws-error">${escHtml(shortStr(session.error, 40))}</span>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');

    bindLiveRooms();
  }

  function bindLiveRooms() {
    document.querySelectorAll('#workstationFloor .workstation').forEach(ws => {
      const sid = ws.getAttribute('data-session');
      if (!sid || !ws.querySelector('.room-bot .boiler-bot')) return;
      const session = state.sessions.find(s => s.sessionID === sid);
      if (!session) return;
      const roomEl = ws.querySelector('.room');
      const ref = {
        roomEl,
        bot: roomEl.querySelector('.room-bot .boiler-bot'),
        roomBot: roomEl.querySelector('.room-bot'),
        light: roomEl.querySelector('.room-light'),
        problem: roomEl.querySelector('.room-problem'),
        tool: roomEl.querySelector('.room-tool'),
        tablet: roomEl.querySelector('.room-tablet')
      };
      const idx = state.sessions.indexOf(session);
      const vis = sessionRoomVis(session, idx);
      if (!ref.bot) return;
      setBotFace(ref.bot, vis.state);
      ref.roomBot.classList.remove('rpos-desk', 'rpos-left', 'rpos-right', 'rpos-review', 'rpos-center');
      ref.roomBot.classList.add('rpos-' + vis.pos);
      ref.light.className = 'room-light st-' + vis.light;
      if (vis.problem) { if (ref.problem) ref.problem.className = 'room-problem p-' + vis.problem; }
      else if (ref.problem) ref.problem.style.display = 'none';
      ref.tool.classList.toggle('on', !!vis.tool);
      ref.tablet.classList.toggle('on', !!vis.tablet && vis.state === 'reviewing');
      ref.roomEl.classList.toggle('room-monitor-done', !!vis.monitorDone);
      ref.roomEl.classList.toggle('room-settled', vis.state === 'complete');
      ref.roomEl.classList.toggle('room-busy', vis.state === 'working' || vis.state === 'reviewing');
      ref.roomEl.classList.remove('dmg-leak', 'dmg-spark', 'dmg-server', 'dmg-clipboard');
      if (vis.problem && vis.problem !== 'clipboard') ref.roomEl.classList.add('dmg-' + vis.problem);
    });
  }

  function diffSessions(prev, next) {
    if (!document.getElementById('terminalFeed')) return;
    const prevMap = new Map(prev.map(s => [s.sessionID, s]));
    const nextMap = new Map(next.map(s => [s.sessionID, s]));
    next.forEach(s => {
      const p = prevMap.get(s.sessionID);
      const label = (s.repo && s.repo.split('/')[1]) || s.project || 'session';
      if (!p) {
        termLine(s.model, label, 'session online', s.status);
      } else if (p.status !== s.status) {
        termLine(s.model, label, s.lastActivity || 'status change', s.status);
      }
    });
    prev.forEach(s => {
      if (!nextMap.has(s.sessionID)) termLine(s.model, s.repo || s.project || 'session', 'session ended', 'STALE');
    });
  }

  function termLine(bot, repo, msg, status) {
    const time = new Date().toTimeString().slice(0, 5);
    addTerminalLine(time, compactModel(bot), `${repo} · ${msg}`, status);
  }

  function shortStr(s, n) {
    s = String(s || '');
    return s.length > n ? s.slice(0, n - 3) + '…' : s;
  }

  document.addEventListener('click', e => {
    const ws = e.target.closest('.live-ws');
    if (!ws) return;
    const sid = ws.getAttribute('data-session');
    const session = state.sessions.find(s => s.sessionID === sid);
    if (!session) return;
    const repo = state.repos.find(r => r.full_name === session.repo);
    if (repo) { openModal(repo.full_name); return; }
    showToast(`${compactModel(session.model)} · ${session.status}${session.lastActivity ? ' — ' + session.lastActivity : ''}`);
  });

  /* =========================================================
     ACTIVITY TERMINAL
     ========================================================= */
  function renderTerminalInitial() {
    const feed = document.getElementById('terminalFeed');
    feed.innerHTML = '';
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);

    addTerminalLine(time, 'SYSTEM', 'Boiler Room online', 'ONLINE');

    if (isLiveMode()) {
      state.sessions.forEach(s => {
        const label = (s.repo && s.repo.split('/')[1]) || s.project || 'session';
        addTerminalLine(time, compactModel(s.model), `${label} · ${s.lastActivity || 'idle'}`, s.status);
      });
      return;
    }

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
    clearRoomRuntime();
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
    clearRoomRuntime();
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
      if (repos) state.repos = repos;
      showDashboard();
    } else { showLanding(); }
  }

  init();
})();
