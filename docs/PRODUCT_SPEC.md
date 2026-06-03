# Product Spec

## Product Motions

**Reserva Viva** helps service businesses respond faster to calls and booking intent. Future modules include voice reception, WhatsApp handoff, booking links, reminders, and recovery flows.

**Venta Viva** helps businesses sell through chat. Future modules include WhatsApp product questions, recommendations, carts, payment links, and owner notifications.

## Core Principle

One SaaS platform supports both motions. Every business is a tenant. Shared platform logic reads tenant settings and connected channel bindings at runtime.

## Implemented Scope

- Email/password signup and login.
- Protected dashboard routes.
- Tenant onboarding.
- Tenant settings management.
- Provider-agnostic channel binding schema for future providers.
- Clean dashboard shell with future modules marked as coming soon.
- Tenant-scoped catalog categories and product/service items.
- Tenant-scoped conversation and message storage.
- Channel binding management UI for future WhatsApp and voice lanes.
- WhatsApp beta lane foundation for Unipile setup records, readiness checks, and pending connection status.

## Non-Goals For Current Build

Do not build live WhatsApp messaging, real Unipile QR/pairing/API calls, 360dialog onboarding, Vapi calls, AI chat, OpenAI calls, Stripe, payment links, n8n workflows, Cal.com, orders, automations, or official API onboarding.
