# Handover Notes

## Read This First

This repo is intended to be movable to a new GitHub/Codex account without relying on old chat history. Start with:

- `docs/PROJECT_OVERVIEW.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/SETUP.md`
- `DESIGN.md`
- `docs/DESIGN_REFERENCE.md`

## Important Product Decisions

- Viva remains one multi-tenant SaaS app.
- Reserva Viva and Venta Viva are motions inside the same platform.
- Medical and regulated categories remain allowed.
- PHI-capable workflows are blocked until BAA/legal/provider/security approvals are complete.
- Live external writes are not enabled by default.
- Provider integrations should be replaceable and tenant-scoped.

## Current Local Preview State

The app has recently been run at:

```text
http://127.0.0.1:3004
```

The development-only preview login is:

```text
http://127.0.0.1:3004/api/dev-preview-login?redirect_to=%2Fdashboard%2Fprivacy
```

This path sets a local cookie and uses mock tenant/user context only in development. It exists to keep UI review possible when Supabase auth is unreachable. It is not production auth.

## Known Issues And Manual Checks

- Supabase DNS/auth was unreachable during recent local preview work, so normal email/password login may need project access, correct env vars, and remote auth configuration.
- The privacy migration may still need to be applied manually to the target Supabase project if it was not pushed remotely:
  - `supabase/migrations/20260517000000_privacy_operations.sql`
- Live provider credentials are intentionally blank in `.env.example`.
- Some dashboard links are foundations/placeholders and may point to future routes or safe-state pages.
- External provider API calls, payments, calls, AI replies, and live automation are not production-enabled.
- Analytics tools must not be added to PHI-heavy screens without masking, BAA/vendor review, and legal approval.

## Sensitive Information

Do not commit:

- `.env`
- `.env.local`
- `.vercel`
- `supabase/.temp`
- `.tmp-*.json`
- `.tmp-*.log`
- service role keys
- API keys
- webhook secrets
- Supabase database passwords
- real patient/customer data

`.env.example` is the canonical list of required variables and should contain placeholders only.

## Design And UX Guidance

The current priority is clarity, not a rebuild. Future improvement work should first produce:

- App map.
- Feature inventory.
- User-flow audit.
- UX risk audit.
- Improvement backlog.

Onboarding improvements worth considering:

- First-login welcome.
- Setup checklist.
- Contextual help on complex pages.
- Guided tour using React Joyride or Driver.js.
- Demo/sample data mode.

Dashboard/UI tooling worth considering later:

- Storybook for component states.
- React Testing Library for user-centered component tests.
- Playwright plus accessibility checks for critical flows.
- PostHog for privacy-reviewed analytics if PHI risk is controlled.

## Source Material

Important docs and references are already in the repo:

- `DESIGN.md`
- `docs/DESIGN_REFERENCE.md`
- `docs/GOOGLE_STITCH_DESIGN_BRIEF.md`
- `docs/WHATSAPP_AI_RESPONDIO_RESEARCH.md`
- `docs/MEDICAL_PRIVACY_SECURITY_PLAN.md`
- `docs/BAA_SUBPROCESSOR_MATRIX.md`
- `docs/PHI_GO_LIVE_RUNBOOK.md`
- `docs/DATA_RETENTION_AND_PRIVACY_REQUESTS.md`
- `docs/INCIDENT_RESPONSE_RUNBOOK.md`

An outside research note reviewed during handover also recommended making the current app legible before redesigning, then considering React Joyride or Driver.js for onboarding, Storybook for UI state matrices, and privacy-reviewed analytics only after PHI exclusions are clear.

