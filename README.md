# The Boiler Room

> A live control room for AI coding sessions, repo health, and operator decisions.

[![Live App](https://img.shields.io/badge/LIVE-THE%20BOILER%20ROOM-3fb950?style=for-the-badge)](https://the-boiler-room-theta.vercel.app/)

![HTML](https://img.shields.io/badge/HTML-CSS-JS-ff6600?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-Functions-ffffff?style=flat-square&logo=vercel&logoColor=000000)
![Local First](https://img.shields.io/badge/Local--First-58a6ff?style=flat-square)
![AI Sessions](https://img.shields.io/badge/AI-Session%20Control-a78bfa?style=flat-square)

**Live app:** https://the-boiler-room-theta.vercel.app/  
**Public demo:** https://phantomcapai.github.io/the-boiler-room/

## What is The Boiler Room?

The Boiler Room is a compact operator dashboard for developers running multiple repositories and AI coding sessions at the same time.

Instead of bouncing between terminals, repos, model windows, and status notes, Boiler Room brings the important signals into one place: what is running, what is blocked, which model is working, how much context is being used, what needs review, and what the next action should be.

The interface is intentionally styled like a living industrial control room rather than a generic SaaS dashboard. The **System Pressure HUD**, animated **AI Bay**, and workstation cards make agent state easy to scan at a glance.

## Highlights

- **System Pressure HUD** — compact view of active, blocked, review, done, and pinned work
- **Animated AI Bay** — visual worker states for active, reviewing, blocked, idle, and completed sessions
- **Live workload view** — ingest and display active AI coding-session telemetry
- **Repo workstations** — model, objective, task, context usage, commit data, and CTO decision in one card
- **Context pressure** — color-coded context meters with critical-state handling
- **Contextual actions** — UI action slots for states such as retry, resume, compact, and approval workflows
- **GitHub sign-in** — authenticated access to real repository data through server-side OAuth
- **Persistent workload storage** — Vercel Blob support with KV/Upstash fallback
- **Local-first metadata** — personal annotations remain in the browser unless explicitly exported
- **Search + filters** — quickly isolate repos and sessions by status, model, or text
- **Import / export** — save or restore local dashboard state as JSON
- **Responsive UI** — desktop control-room layout with a compact mobile HUD

## How it fits together

```text
AI coding sessions / OpenCode
            │
            ▼
   workload ingest API
            │
            ▼
┌─────────────────────────────┐
│       THE BOILER ROOM       │
│                             │
│  System Pressure HUD        │
│  Animated AI Bay            │
│  Repo / Session Cards       │
│  Context + Status           │
│  Operator Actions           │
└─────────────────────────────┘
            │
      ┌─────┴─────┐
      ▼           ▼
 GitHub OAuth   Vercel Blob
 / repo data    / KV fallback
```

## Public vs authenticated mode

The GitHub Pages build is a **demo-only surface** with fictional project data.

The Vercel deployment can use GitHub OAuth to show authenticated repository data and can receive live workload telemetry from the local OpenCode integration.

Personal annotations such as assigned model, context %, objective, current task, next action, CTO decision, notes, and next prompt remain local to the browser unless explicitly exported.

## Architecture

Boiler Room keeps the frontend deliberately lightweight:

```text
index.html              UI structure
styles.css              dark industrial / pixel control-room theme
app.js                  rendering, state, workstation + AI Bay behavior
repos.json               demo seed data
api/auth/                GitHub OAuth + session endpoints
api/github/              authenticated GitHub proxy
api/workload/            live AI-session workload ingest + reads
vercel.json              Vercel routing / headers
.github/                 GitHub Pages workflow + repo templates
```

The frontend is plain HTML, CSS, and JavaScript. Server-side functionality is handled by small Vercel functions rather than a frontend framework.

## Local development

### Vercel dev mode

```bash
npm install
npm run dev
```

Copy `.env.example` to your local environment and configure only the services you intend to use.

Relevant variables include:

```text
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
SESSION_SECRET
WORKLOAD_INGEST_SECRET
```

Persistent workload storage can use Vercel Blob. KV / Upstash can be configured as a fallback.

### Static demo mode

The demo can also run without the authenticated APIs:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub OAuth

For authenticated repository access:

1. Create a GitHub OAuth App.
2. Configure `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and a strong `SESSION_SECRET` in Vercel.
3. Use the deployed callback URL for the live Boiler Room deployment.
4. Never commit real credentials.

OAuth token exchange happens server-side. Session cookies are HttpOnly, Secure, and SameSite=Lax.

## Workload telemetry

Live AI-session state is accepted through the workload ingest API using a shared ingest secret. The server sanitizes workload records before they are surfaced to the UI.

Storage behavior:

- **Vercel Blob** when attached to the project
- **KV / Upstash** as a fallback when configured
- **Ephemeral memory** if neither persistent store is available

The local integration and cloud UI are intentionally separated so local tooling can remain the execution environment while Boiler Room acts as the control surface.

## Security model

- API keys and credentials are not committed to the repository
- `.env` files are gitignored
- GitHub OAuth token exchange occurs server-side
- Session cookies are HttpOnly and Secure
- Workload ingestion requires a shared secret
- Imported JSON is treated as data, not executable content
- Live operator actions should be scoped to the exact session/request they target
- Public demo data is fictional

> The current signed session-cookie design protects integrity but does not provide encrypted server-side session storage. Moving sessions fully server-side remains a security improvement on the roadmap.

## Current direction

Boiler Room is evolving from a monitoring dashboard into a lightweight **AI operator console**.

Near-term work includes:

- tighter OpenCode session integration
- real one-click operator approval flows
- richer state-driven robot animations and AI Bay movement
- automatic context / compaction signals
- stronger multi-device control
- server-side session storage

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

No license file has been added yet. Until a license is explicitly chosen, all rights are reserved by the author.
