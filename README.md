# Viva Platform

Viva is the shared multi-tenant SaaS foundation for **Reserva Viva** and **Venta Viva**.

- **Reserva Viva:** future voice receptionist, missed-call recovery, and booking support.
- **Venta Viva:** future WhatsApp sales, catalog, cart, and checkout support.

Steps 1-5 build the SaaS foundation and unpaid WhatsApp beta preparation: auth, tenants, onboarding, dashboard, settings, catalog, conversation/message storage, provider-agnostic channel bindings, WhatsApp beta setup records, Supabase migrations, RLS, and project memory docs.

## Current Scope

Implemented in Steps 1-5:

- Next.js, TypeScript, Tailwind
- Supabase Auth email/password flow
- Tenant onboarding
- Protected dashboard routes
- Settings updates for tenant profile and tenant settings
- Membership-based RLS migrations
- Tenant-scoped catalog categories and product/service items
- Tenant-scoped conversation and message records
- Provider-agnostic channel binding table and dashboard UI for future WhatsApp/voice providers
- WhatsApp beta setup page for Unipile readiness and pending connection records

Not implemented yet:

- Live WhatsApp messaging, real Unipile QR/API calls, Meta Cloud API, 360dialog
- Vapi voice
- AI agent tools or OpenAI calls
- Stripe billing or payment links
- n8n automations
- Cal.com booking sync
- orders, payments, automations, customers, official API onboarding

## Local Setup

For complete fresh-clone setup, GitHub handover, and deployment guidance, read:

- `docs/PROJECT_OVERVIEW.md`
- `docs/SETUP.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/HANDOVER_NOTES.md`
- `GITHUB_HANDOVER_SUMMARY.md`

1. Install dependencies.

   ```bash
   pnpm install
   ```

2. Copy environment variables.

   ```bash
   cp .env.example .env.local
   ```

3. Add Supabase values.

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://spukghkxnpyvgzstpejz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Apply Supabase migrations.

   If you have the Supabase CLI:

   ```bash
   supabase login
   supabase init
   supabase link --project-ref spukghkxnpyvgzstpejz
   supabase db push
   ```

   The CLI will ask for the database password. Do not commit that password.

   Without the CLI, paste each file in `supabase/migrations` into the Supabase SQL Editor in timestamp order and run it.

5. For easiest local testing, disable email confirmation in Supabase Auth while developing:

   `Supabase Dashboard -> Authentication -> Providers -> Email -> Confirm email = off`

6. Run the app.

   ```bash
   pnpm dev
   ```

## Acceptance Checks

- User can sign up and log in.
- User without a tenant is redirected to onboarding.
- Onboarding creates tenant, owner membership, and tenant settings.
- Dashboard displays tenant data.
- Settings page updates tenant and tenant settings.
- Catalog page can create categories and products/services.
- Conversations page can create conversation/message records after the Step 3 migration is live.
- Channels page can create provider-agnostic binding records.
- WhatsApp beta page can prepare an unpaid Unipile beta lane record.
- RLS blocks cross-tenant access.
- Docs in `/docs` describe the product memory and build order.

## Deployment Notes

Vercel is connected to the team `Richard Hardy's projects`. The GitHub remote should be:

```bash
git remote add origin https://github.com/RichSaenz1/RichardHardySaenz
```

Deploy only after the Supabase migration is live and Vercel has the same environment variables.

## Medical Privacy Launch Gate

Medical clients are allowed to sign up. Before any live workflow processes protected health information, follow `/docs/MEDICAL_PRIVACY_SECURITY_PLAN.md`, `/docs/BAA_SUBPROCESSOR_MATRIX.md`, `/docs/PHI_GO_LIVE_RUNBOOK.md`, `/docs/DATA_RETENTION_AND_PRIVACY_REQUESTS.md`, and `/docs/INCIDENT_RESPONSE_RUNBOOK.md`. The dashboard Privacy ops page tracks these approval and request workflows.
