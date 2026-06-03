# Codex Instructions

## Project Boundary

Build one multi-tenant SaaS platform named Viva. Do not split Reserva Viva, Venta Viva, or Viva Med into separate apps or separate databases.

## Current Rule

Steps 1-16 are implemented as foundations: auth, tenants, onboarding, dashboard, settings, catalog, conversation/message storage, channel binding records, WhatsApp beta setup records, Vapi voice setup records, AI tool registry records, order/payment-link storage records, n8n workflow registry records, Stripe billing placeholder records, Cal.com booking sync placeholder records, official WhatsApp placeholder records, monitoring events, customer/consent records, compliance review records, provider activation states, migrations, RLS, and docs.

Do not add live WhatsApp messaging, real Unipile API calls, official WhatsApp/360dialog/Cloud API calls, Vapi calls, AI replies, Stripe checkout/payment links/subscriptions, n8n webhooks/workflow execution, Cal.com sync, payouts, or outbound messaging until explicitly requested.

## Provider Rule

Keep channel integrations provider-agnostic. Store future connections in `channel_bindings` so tenants can remain connected while the platform adds or changes provider lanes. The current bindings UI and WhatsApp beta UI store records only; they do not activate external providers.

## Design Rule

Use a clean, light, premium SaaS interface. No decorative clutter. Dashboard first, not marketing first.

Before future styling work, read the root `DESIGN.md` first. Then use `docs/DESIGN_REFERENCE.md`, the local screenshot folder, and the Viva Design System ZIP as supporting references. Do not apply styling until the user explicitly asks for a design pass.

## Security Rule

Never commit service-role keys, database passwords, provider API keys, or real client data. Use Supabase RLS and session-scoped clients for app reads/writes.
