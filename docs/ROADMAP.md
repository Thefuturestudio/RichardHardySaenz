# Roadmap

## Current Roadmap Position

VivaApp has a broad foundation build in place. The app is useful for product review, safe internal demos, UX iteration, documentation, and next-phase implementation. It is not fully production-ready for live providers, PHI, paid billing, or autonomous customer-facing automation.

## Complete

- Step 1: SaaS foundation, Supabase auth wiring, tenant onboarding, protected dashboard shell, settings, and RLS migrations.
- Step 2: Tenant-scoped catalog categories and product/service items.
- Step 3: Tenant-scoped conversation and message storage.
- Step 4: Provider-agnostic channel binding records and management UI.
- Step 5: WhatsApp beta lane foundation for Unipile setup status.
- Step 6: Vapi voice lane foundation for safe voice binding/session records.
- Step 7: AI tool registry foundation for future controlled agent tools.
- Step 8: Order and payment-link storage foundation.
- Step 9: n8n automation workflow registry foundation.
- Step 10: Stripe billing account foundation.
- Step 11: Cal.com booking sync foundation.
- Step 12: Official WhatsApp / 360dialog foundation.
- Step 13: Monitoring/admin dashboard foundation.
- Step 14: Customer/contact and consent record foundation.
- Step 15: Compliance review foundation.
- Step 16: Provider activation console foundation.
- Medical privacy/security docs and `data_privacy_requests` migration.
- Privacy operations dashboard for approval checks and request tracking.
- Viva Med dashboard surface for medical appointment, handoff, privacy, and launch-gate coordination.
- Brand assets, Viva font assets, design reference docs, and UI export screenshots.
- Development-only preview login route for local review when Supabase auth is unavailable.

## In Progress

- Product legibility and GitHub handover documentation.
- UI clarity pass across dashboard pages, onboarding, empty states, and safe-mode messaging.
- Medical/privacy launch gating and owner-review workflow.
- Provider readiness pages for WhatsApp beta, voice, official WhatsApp, Stripe, Cal.com, webhooks, outbox, credentials, and production QA.

## Not Yet Enabled

- Live Unipile API calls, QR pairing, WhatsApp sending, or customer messaging.
- Live WhatsApp Cloud API or 360dialog onboarding.
- Live Vapi phone provisioning or calls.
- OpenAI or other AI runtime execution against real tenant data.
- Stripe customers, checkout sessions, subscriptions, charges, payouts, or payment links.
- Cal.com live sync, event type creation, or booking writes.
- n8n live automation execution.
- Production PHI workflows.
- Analytics/session replay on PHI-capable screens.

## Recommended Next Phases

1. Create an app map and user-flow audit: routes, components, data flows, onboarding, empty/error states, and medical safety risks.
2. Improve onboarding clarity: first-run checklist, stronger setup explanations, and role-aware guidance.
3. Improve dashboard visibility: clearer page hierarchy, empty states, status copy, and launch readiness labels.
4. Add Storybook or a lightweight component inventory if UI work expands.
5. Add product analytics only after privacy policy, masking, BAA/vendor posture, and PHI exclusions are defined.
6. Apply the remote Supabase migrations and run a fresh auth/onboarding test in the target project.
7. Gate any live provider activation behind explicit owner approval and documented provider credentials.

## Upgrade Principle

Build providers as replaceable modules. Existing clients should keep working when new provider lanes are added. Migrations from beta WhatsApp to official WhatsApp may require client approval, but product settings and dashboard data must remain intact.
