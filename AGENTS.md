# VivaApp Codex Instructions

This project is the Viva multi-tenant SaaS dashboard for Reserva Viva and Venta Viva. Treat it as an active medical-capable operations product, not a disposable prototype.

## Core Rules

- Do not split Reserva Viva and Venta Viva into separate apps or databases.
- Keep medical and regulated business categories allowed to sign up.
- Do not enable PHI-capable workflows until legal, BAA, MFA, provider, retention, and incident-response gates are approved.
- Do not add live provider writes, live customer messaging, calls, checkout, calendar sync, or AI replies without explicit approval.
- Preserve the safe-build posture: internal previews and demo records are allowed; real patient/customer data and external writes are gated.
- Never commit `.env`, `.env.local`, Vercel project metadata, Supabase local cache, test credentials, logs, or temporary run results.

## UI Direction

- Viva should feel like a calm, premium medical/business operations dashboard.
- Favor clear navigation, obvious status labels, polished empty states, accessible typography, and restrained visual styling.
- Use the root `DESIGN.md` as the visual source of truth before styling changes.
- Use `docs/DESIGN_REFERENCE.md` and the assets in `public/brand` and `public/fonts` as supporting references.
- Before broad redesign work, generate or update route, component, and user-flow documentation.

## Engineering Direction

- Prefer small, verifiable changes that preserve existing behavior.
- Use the existing Next.js App Router, TypeScript, Tailwind, Supabase SSR, and server-action patterns.
- Keep provider integrations behind tenant-scoped foundation tables and `channel_bindings`.
- Run checks after changes when possible:
  - `pnpm install --frozen-lockfile`
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm build`

## Handover Context

Start with these docs:

1. `docs/PROJECT_OVERVIEW.md`
2. `docs/HANDOVER_NOTES.md`
3. `docs/SETUP.md`
4. `docs/ARCHITECTURE.md`
5. `docs/ROADMAP.md`
6. `GITHUB_HANDOVER_SUMMARY.md`

