# Setup

## Requirements

- Node.js 22 or compatible current LTS.
- pnpm 10.33.2. The repo pins this through `packageManager`, so Corepack can provide it.
- Supabase project access.
- Vercel account/project access for deployment.

## Fresh Clone

```bash
corepack enable
git clone <github-repo-url>
cd <repo-folder>
pnpm install --frozen-lockfile
```

If the lockfile needs to be refreshed intentionally, use:

```bash
pnpm install
```

## Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Fill in `.env.local` with real values. Do not commit `.env.local`.

Required for normal Supabase auth/data:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000
MEDICAL_PRIVACY_MODE=true
ENABLE_LIVE_STRIPE_CHECKOUT=false
```

Server-only optional variables:

```env
SUPABASE_SERVICE_ROLE_KEY=
PLATFORM_OWNER_EMAIL=
UNIPILE_API_KEY=
UNIPILE_DSN=
UNIPILE_WEBHOOK_SECRET=
VAPI_API_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CALCOM_API_KEY=
CALCOM_WEBHOOK_SECRET=
WHATSAPP_OFFICIAL_PROVIDER=360dialog
WHATSAPP_OFFICIAL_API_KEY=
WHATSAPP_OFFICIAL_WEBHOOK_SECRET=
N8N_WEBHOOK_URL=
```

Leave live-provider secrets blank until that provider is approved for use.

## Supabase Setup

Apply migrations in timestamp order from:

```text
supabase/migrations
```

With Supabase CLI:

```bash
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

Without Supabase CLI:

1. Open the Supabase SQL Editor.
2. Open each file in `supabase/migrations` in timestamp order.
3. Paste and run each migration.
4. Confirm the privacy migration is applied:

```text
supabase/migrations/20260517000000_privacy_operations.sql
```

For local development, email confirmation can be disabled in Supabase Auth during testing. Re-enable production-appropriate auth settings before launch.

## Run Locally

Default local server:

```bash
pnpm dev
```

Fixed preview port used in recent Codex sessions:

```bash
pnpm dev -- --hostname 127.0.0.1 --port 3004
```

Normal login:

```text
http://127.0.0.1:3004/login
```

Development-only preview login:

```text
http://127.0.0.1:3004/api/dev-preview-login?redirect_to=%2Fdashboard%2Fprivacy
```

Use the preview login only for local review when Supabase auth is unavailable.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Optional Playwright checks:

```bash
node tools/e2e-five-step-check.js
node tools/e2e-launch-ops-check.js
```

These scripts expect a running local app and working test/auth setup.
They also require a real Supabase project and ignored local `.tmp-e2e-account.json` test credentials, so do not run them against production data.

## Build

```bash
pnpm build
```

If build fails on Supabase/network access, confirm `.env.local` is configured and the Supabase host is reachable.

## Deploy

Recommended Vercel flow:

```bash
corepack enable
pnpm build
npx vercel deploy
npx vercel deploy --prod
```

Before production deploy:

- Add all required Vercel environment variables.
- Confirm Supabase redirect URLs include the production domain.
- Confirm all migrations are applied remotely.
- Confirm live-provider secrets are blank unless approved.
- Confirm `MEDICAL_PRIVACY_MODE=true`.
- Do not enable PHI workflows until the runbooks and provider/legal checks are complete.
