# GitHub Handover Summary

## What Was Prepared

This project was prepared for transfer to GitHub and continuation from a new Codex account. The handover package documents the product, architecture, setup, roadmap, medical safety posture, design references, and remaining manual checks.

The repo now includes a repo-level `AGENTS.md` so future Codex sessions can understand the core rules without old chat history.

## Files Added Or Updated

Added:

- `AGENTS.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/SETUP.md`
- `docs/HANDOVER_NOTES.md`
- `GITHUB_HANDOVER_SUMMARY.md`
- `src/components/dashboard/safe-foundation-page.tsx`

Updated:

- `.gitignore`
- `package.json`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `src/lib/data/tenant.ts`
- `src/lib/supabase/middleware.ts`
- `src/lib/data/privacy-ops.ts`

Important existing project files to include in GitHub:

- `src/**`
- `public/brand/**`
- `public/fonts/**`
- `supabase/migrations/**`
- `docs/**`
- `DESIGN.md`
- `README.md`
- `package.json`
- `pnpm-lock.yaml`
- `next.config.ts`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `tsconfig.json`
- selected UI/QA screenshots and export assets if repository size is acceptable.

## Sensitive Files Not To Commit

Do not commit:

- `.env`
- `.env.local`
- `.vercel`
- `supabase/.temp`
- `.tmp-*.json`
- `.tmp-*.log`
- real API keys, passwords, service-role keys, webhook secrets, or patient/customer data.

`.gitignore` was updated to keep temporary test JSON/log files and debug failure screenshots out of Git.

## Manual Checking Still Needed

- Confirm the target Supabase project has all migrations applied, especially:
  - `supabase/migrations/20260517000000_privacy_operations.sql`
- Confirm Supabase auth redirect URLs for local and production domains.
- Confirm Vercel environment variables are configured from `.env.example`.
- Confirm no live provider secrets are added until that provider is approved.
- Confirm legal/BAA/MFA/provider/retention/incident gates before any PHI workflow goes live.
- Decide whether to commit large generated export assets under `exports/linkedin-content`.
- Run end-to-end browser checks after Supabase auth is working in the target account.

## Verification Commands

From a fresh clone:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm build
```

Verification run during handover:

- `corepack pnpm install --frozen-lockfile`: passed.
- `corepack pnpm lint`: passed.
- `corepack pnpm typecheck`: passed after removing stale local `tsconfig.tsbuildinfo`.
- `corepack pnpm build`: passed.
- Secret scan: no high-confidence secret patterns found in intended text files.
- Ignore check: `.env.local`, `.vercel`, `supabase/.temp`, `.tmp-*.json`, `.tmp-*.log`, and debug failure screenshots are ignored.

The Playwright utility scripts were inspected but not run during this pass because they require a real Supabase service role and ignored local `.tmp-e2e-account.json` credentials.

Run locally:

```bash
pnpm dev -- --hostname 127.0.0.1 --port 3004
```

Preview local dashboard without Supabase auth:

```text
http://127.0.0.1:3004/api/dev-preview-login?redirect_to=%2Fdashboard%2Fprivacy
```

## Commands To Push To GitHub

If this folder does not already have a remote:

```bash
git remote add origin https://github.com/<OWNER>/<REPO>.git
```

Review changed files:

```bash
git status --short
git diff --stat
```

Stage everything Git should track:

```bash
git add .
git status --short
```

Commit:

```bash
git commit -m "Prepare VivaApp GitHub handover"
```

Push:

```bash
git branch -M main
git push -u origin main
```

If the repo already has history and a branch, use the current branch instead of forcing `main`.

## Commands To Clone And Continue In A New Codex Account

```bash
corepack enable
git clone https://github.com/<OWNER>/<REPO>.git
cd <REPO>
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev -- --hostname 127.0.0.1 --port 3004
```

Then open:

```text
http://127.0.0.1:3004/api/dev-preview-login?redirect_to=%2Fdashboard%2Fprivacy
```

Before making changes in the new Codex account, read:

```text
AGENTS.md
docs/PROJECT_OVERVIEW.md
docs/HANDOVER_NOTES.md
docs/SETUP.md
docs/ARCHITECTURE.md
docs/ROADMAP.md
DESIGN.md
```
