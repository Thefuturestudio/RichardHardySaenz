# Architecture

## Stack

- Framework: Next.js App Router.
- Language: TypeScript.
- UI: React, Tailwind CSS, lucide-react icons.
- Auth/data: Supabase Auth, Supabase Postgres, Supabase SSR clients, RLS.
- Hosting target: Vercel.
- Package manager: pnpm.
- Checks: ESLint, TypeScript, Next build.

Future or gated integrations:

- WhatsApp beta: Unipile.
- Official WhatsApp: 360dialog or WhatsApp Cloud API.
- Voice: Vapi.
- AI: OpenAI or approved configured model.
- Automations: n8n.
- Booking: Cal.com.
- Billing: Stripe.

## Folder Structure

```text
src/app                 Next.js routes, layouts, server actions, API routes
src/components          UI, dashboard, auth, catalog, channel, privacy components
src/lib                 Supabase clients, data loaders, server helpers, constants
src/types               Database and shared TypeScript types
supabase/migrations     Ordered SQL migrations for schema, RLS, and functions
public/brand            Viva and TFS logo/favicon assets
public/fonts            Satoshi and VivaHead font assets
docs                    Product, architecture, compliance, privacy, and handover docs
exports                 LinkedIn/UI export screenshots and generated visual sheets
tools                   Playwright checks and utility scripts
```

## Important Runtime Files

- `middleware.ts`: routes all requests through Supabase session middleware.
- `src/lib/supabase/middleware.ts`: protects `/dashboard` and `/onboarding`; includes development-only preview-session handling.
- `src/lib/supabase/server.ts`: server-side Supabase SSR client.
- `src/lib/supabase/client.ts`: browser-side Supabase client.
- `src/lib/supabase/admin.ts`: service-role client for approved server-only admin operations.
- `src/lib/data/tenant.ts`: current user and tenant context loading.
- `src/lib/constants.ts`: business types, languages, tones, timezones, dashboard navigation, and future module metadata.
- `src/components/dashboard/dashboard-shell.tsx`: main dashboard layout.
- `src/components/dashboard/sidebar.tsx`: dashboard navigation sections.
- `DESIGN.md`: visual source of truth.

## Routes

Public/auth routes:

- `/login`
- `/signup`
- `/onboarding`
- `/auth/callback`

Dashboard routes:

- `/dashboard`
- `/dashboard/conversations`
- `/dashboard/bookings`
- `/dashboard/orders`
- `/dashboard/catalog`
- `/dashboard/customers`
- `/dashboard/ai-tools`
- `/dashboard/automations`
- `/dashboard/channels`
- `/dashboard/channels/whatsapp-beta`
- `/dashboard/channels/voice`
- `/dashboard/channels/official-whatsapp`
- `/dashboard/provider-credentials`
- `/dashboard/webhooks`
- `/dashboard/outbox`
- `/dashboard/go-live`
- `/dashboard/pilot-workflow`
- `/dashboard/test-center`
- `/dashboard/test-data`
- `/dashboard/production-qa`
- `/dashboard/privacy`
- `/dashboard/compliance`
- `/dashboard/activation`
- `/dashboard/admin`
- `/dashboard/settings`
- `/dashboard/billing`

API routes:

- `/api/dev-login`: development-only Supabase email/password helper.
- `/api/dev-preview-login`: development-only local preview session used when Supabase auth is unavailable.
- `/api/webhooks/calcom`: Cal.com webhook foundation.
- `/api/webhooks/stripe`: Stripe webhook foundation.
- `/api/webhooks/unipile`: Unipile webhook foundation.

## Data Model

The Supabase schema is migration-driven. Apply files in `supabase/migrations` in timestamp order. Key tables include:

- `profiles`
- `tenants`
- `tenant_memberships`
- `tenant_settings`
- `channel_bindings`
- catalog, conversation, message, order, customer, consent, workflow, billing, booking, provider activation, and privacy-operation tables from later migrations.

RLS policies scope tenant data through tenant membership helpers. See `docs/RLS_POLICIES.md` and `docs/DATA_MODEL.md`.

## Provider-Agnostic Channels

Channel integrations must sit behind `channel_bindings`, not inside tenant business data. A tenant may use Unipile during beta and later migrate to 360dialog or WhatsApp Cloud API without changing dashboard settings, catalog, services, or tenant identity.

Provider migrations may require client action, but platform upgrades should not break existing tenants.

## Medical Privacy Architecture

Medical categories are allowed. PHI-capable workflows are gated.

The key privacy docs are:

- `docs/MEDICAL_PRIVACY_SECURITY_PLAN.md`
- `docs/BAA_SUBPROCESSOR_MATRIX.md`
- `docs/PHI_GO_LIVE_RUNBOOK.md`
- `docs/DATA_RETENTION_AND_PRIVACY_REQUESTS.md`
- `docs/INCIDENT_RESPONSE_RUNBOOK.md`

The key migration is:

- `supabase/migrations/20260517000000_privacy_operations.sql`

## Development Preview Session

`src/app/api/dev-preview-login/route.ts` sets a local preview cookie only when `NODE_ENV !== "production"`. This is for local product review when Supabase auth or DNS is unavailable. It must not be considered production authentication.

## Not Yet Implemented

The project contains foundations, not live activation, for:

- Live Unipile/WhatsApp sending.
- Vapi calls.
- OpenAI runtime responses.
- Stripe payments.
- Cal.com sync.
- n8n execution.
- Production PHI flows.
