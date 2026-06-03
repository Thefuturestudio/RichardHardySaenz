# Project Overview

## What This Project Is

VivaApp is a Next.js, TypeScript, Tailwind, and Supabase SaaS dashboard for The Future Studio's Viva platform. It is designed as one multi-tenant product with two commercial motions and one medical vertical:

- Reserva Viva: receptionist, missed-call recovery, booking support, and human handoff.
- Venta Viva: WhatsApp-led sales, catalog support, carts, checkout links, and owner notifications.
- Viva Med: medical appointment operations, safe patient handoff, privacy operations, and PHI go-live gates.

The current app is dashboard-first. It is not a marketing site and it is not a general-purpose medical advice chatbot.

## Who It Is For

The product is for small and medium businesses that need operational automation around conversations, bookings, channels, catalog/order workflows, and launch readiness. The current build also supports medical, dental, therapy, wellness, med spa, home health, and other sensitive categories, but PHI-capable workflows are intentionally gated before launch.

## What Has Been Built

The repo contains a working foundation for:

- Supabase email/password auth and protected dashboard routes.
- Tenant onboarding and tenant-scoped settings.
- Dashboard shell with sidebar navigation, light/dark styling, brand assets, and safe-build messaging.
- Catalog categories and catalog items.
- Conversations and messages.
- Channel binding foundations.
- WhatsApp beta lane setup records.
- Voice, AI tools, orders, automations, billing, booking sync, official WhatsApp, customers, compliance, provider activation, production QA, test data, privacy ops, and admin/monitoring foundation pages.
- Webhook route foundations for Stripe, Unipile, and Cal.com.
- Medical privacy operations with `data_privacy_requests` migration and dashboard UI.
- Brand/design system assets under `public/brand`, `public/fonts`, `DESIGN.md`, and `docs/DESIGN_REFERENCE.md`.
- LinkedIn/UI export assets under `exports/linkedin-content`.

## Current Status

The app is locally runnable and has a development-only preview login route at:

```text
http://127.0.0.1:3004/api/dev-preview-login?redirect_to=%2Fdashboard%2Fprivacy
```

That preview path exists because Supabase auth may be unreachable or not configured in a fresh local environment. It is gated by `NODE_ENV !== "production"` and should not be used as production auth.

Live provider activation is not complete. The dashboard contains many foundations and safe-mode placeholders, but the app must not be treated as production-ready for PHI, paid billing, live WhatsApp, voice calls, AI responses, or booking sync until the required manual approvals are complete.

## Product Principles

- Keep Viva as one multi-tenant platform.
- Keep provider integrations replaceable.
- Keep medical allowed, but gate PHI-capable workflows.
- Prefer clarity over feature density.
- Avoid unsafe medical claims, diagnosis, or treatment guidance.
- Use demo data and internal previews until legal/provider approvals are complete.
