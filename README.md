# The Boiler Room

> One control room for every repo and every AI coding session.

![HTML](https://img.shields.io/badge/HTML-CSS-JS-ff6600?style=flat-square)
![Static Site](https://img.shields.io/badge/Static-Site-3fb950?style=flat-square)
![Local First](https://img.shields.io/badge/Local--First-58a6ff?style=flat-square)
![Zero Backend](https://img.shields.io/badge/Zero-Backend-d29922?style=flat-square)

**Live App:** [the-boiler-room.vercel.app](https://the-boiler-room.vercel.app)
**GitHub Pages Demo:** [phantomcapai.github.io/the-boiler-room](https://phantomcapai.github.io/the-boiler-room/)

## What It Does

The Boiler Room is a local-first control room for developers juggling multiple repositories and AI coding agents. It shows repo status, assigned models, context usage, objectives, next actions, and CTO PASS/FIX decisions in one place — no server, no database, no account required for the demo.

## Features

- **Repo cards** with status, model, context usage, objective, and commit info
- **Overview stats** — total, annotated, pinned, active 24h with progress bar
- **Context usage** with color-coded progress bars (green / warning / critical)
- **Detail modal** — click any card to view and edit all fields
- **Copy Next Prompt** — one-click prompt generation for AI sessions
- **Filter & search** — by status, model, CTO decision, or free text
- **Import / Export** — save and restore dashboard state as JSON
- **Reset to defaults** — restore seed data from `repos.json`
- **Keyboard accessible** — full Tab navigation, focus trap in modal, Escape to close
- **Dark control-room theme** — compact, scannable, responsive

## Public Demo

The public demo at [phantomcapai.github.io/the-boiler-room](https://phantomcapai.github.io/the-boiler-room/) uses **fictional project data only**. It does not represent real projects, real model assignments, real objectives, or real operational state.

Allowed demo repos: `example-api`, `example-frontend`, `example-agent`, `example-docs`.

## GitHub Sign-In Architecture

If you deploy with Vercel and configure GitHub OAuth, The Boiler Room supports authenticated access to your real repositories:

- OAuth flow uses `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` (server-side only)
- Sessions are stored in HttpOnly, Secure, SameSite=Lax cookies
- No GitHub tokens are exposed to client-side JavaScript
- No tokens are stored in localStorage
- Repositories are fetched server-side and returned to the authenticated user only

GitHub Pages is demo-only and does not support authentication.

## Privacy Model

| Layer | Storage | Scope |
|-------|---------|-------|
| **Public demo** | Embedded fictional data | Anyone |
| **Personal metadata** | Browser localStorage | You only |
| **GitHub session** | Server-side HttpOnly cookie | Per-deployment |

Personal fields (assigned model, context %, objective, current task, next action, CTO decision, notes, next prompt) remain in your browser unless you explicitly export them.

No personal annotations are uploaded to GitHub. No cloud synchronization. No analytics.

## Import / Export

- **Export**: Downloads current localStorage state as a JSON file. Generated entirely in-browser.
- **Import**: Accepts a JSON file. Validates structure. Rejects malformed data. Never executes imported content.
- **Reset**: Restores demo defaults from `repos.json`.

Do not commit exported JSON files if they contain private notes.

## Local Development

### Option A: Direct file open

Open `index.html` in your browser. The app includes embedded seed data, so it works without a server.

> If `repos.json` fails to load (CORS on `file://`), the app automatically uses the embedded defaults.

### Option B: Local HTTP server (recommended)

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Vercel Deployment

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.
3. Framework preset: **Other** (static).
4. Build command: leave empty.
5. Output directory: **.** (root).
6. Click **Deploy**.

No `vercel.json` is required for basic deployment. The included `vercel.json` adds clean URLs and cache headers for `repos.json`.

### Vercel Environment Variables (for GitHub auth)

Set these in the Vercel dashboard under **Settings > Environment Variables**:

- `GITHUB_CLIENT_ID` — from your GitHub OAuth App
- `GITHUB_CLIENT_SECRET` — from your GitHub OAuth App
- `SESSION_SECRET` — a random 32+ character string

**Never commit actual values.** Use the Vercel UI to set them.

### OAuth Callback URL

After deploying, update your GitHub OAuth App callback URL to:

```
https://the-boiler-room.vercel.app/api/auth/callback
```

## GitHub Pages Deployment

1. Go to **Settings > Pages** in your GitHub repo.
2. Under **Source**, select **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy-pages.yml`) runs on every push to `main`.
4. Your site will be available at `https://phantomcapai.github.io/the-boiler-room/`.

All asset paths are relative, so the app works correctly under a subpath.

## Architecture

Pure static site — no build step, no framework, no dependencies.

```
index.html      — dashboard structure
styles.css      — dark control-room theme
app.js          — data layer, rendering, editing, persistence
repos.json      — seed data (source of truth)
vercel.json     — Vercel static config
api/            — Vercel serverless functions (auth + GitHub proxy)
.github/        — Pages deployment workflow, issue/PR templates
```

### Data Model

Each repo entry:

| Field | Description |
|-------|-------------|
| `id` | Unique identifier |
| `name` | Display name |
| `url` | GitHub URL |
| `model` | Assigned AI model |
| `status` | ACTIVE, BLOCKED, REVIEW, or DONE |
| `context` | Context usage percentage (0-100) |
| `objective` | Current high-level objective |
| `currentTask` | What's being worked on now |
| `nextAction` | What to do next |
| `lastCommitSha` | Latest commit hash |
| `lastCommitMessage` | Latest commit message |
| `ctoDecision` | PENDING, PASS, FIX, or DONE |
| `notes` | Freeform notes |
| `nextPrompt` | Pre-built prompt for Copy Next Prompt |

## Security Notes

- No API keys, tokens, or credentials are committed to this repository.
- `.env` files are gitignored.
- Session cookies use HttpOnly, Secure, and SameSite=Lax flags.
- GitHub OAuth state parameter is signed and verified to prevent CSRF.
- The `api/` directory contains Vercel serverless functions that handle OAuth token exchange server-side.
- The GitHub access token is stored in a signed session cookie. The cookie is HttpOnly (not readable by JavaScript) and Secure (transmitted only over HTTPS). However, the session payload is signed but not encrypted — the token is base64url-encoded in the cookie value. This provides integrity but not confidentiality at the cookie layer. For maximum security, consider storing sessions server-side in a database.

## Limitations

- Data lives in localStorage (single browser, single device).
- No automatic context monitoring.
- No sync across devices.
- No real-time updates.
- Session cookie stores the GitHub access token (signed but not encrypted).

## Roadmap

- Server-side session storage (database-backed)
- Automatic context monitoring
- Webhook updates
- Multi-device sync
- Codex/Claude session tracking

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

No license file has been added yet. Until one is chosen, all rights are reserved by the author.
