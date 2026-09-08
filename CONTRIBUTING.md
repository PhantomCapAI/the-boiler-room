# Contributing to The Boiler Room

Thanks for considering a contribution.

## Reporting Bugs

Open an issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser and OS

## Submitting Changes

1. Fork the repo and create a branch from `main`.
2. Make your changes.
3. Test in a local HTTP server (`python -m http.server 8000`).
4. Open a pull request with a clear description of the change.

## Code Style

- Plain HTML/CSS/JS only. No frameworks, no build tools.
- Keep changes minimal and focused.
- Match existing patterns in the codebase.

## What Not to Commit

- Personal dashboard exports (they may contain private notes).
- `.env` files or secrets.
- API keys, tokens, or credentials.
- OS-generated files (`.DS_Store`, `Thumbs.db`).
