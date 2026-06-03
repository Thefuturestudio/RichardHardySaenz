# Executive Summary

Viva is one multi-tenant SaaS platform for two commercial motions:

- **Reserva Viva:** receptionist, missed-call recovery, and booking support for service businesses.
- **Venta Viva:** WhatsApp-led sales, product guidance, carts, and checkout support for chat-based sellers.

The platform must stay one codebase, one tenant model, one dashboard, and one event model. Tenants are businesses. Tenant-specific settings are injected at runtime; assistants and workflows must not be cloned per customer.

## Current Build Order

Steps 1-5 are the foundation now: auth, tenants, onboarding, dashboard, settings, catalog, conversation/message storage, provider-agnostic channel bindings, WhatsApp beta setup records, migrations, RLS, and docs.

Future phases are **NOT YET IMPLEMENTED**: live WhatsApp beta QR/API calls, Vapi voice, AI tools, orders, payment links, n8n, Stripe billing, Cal.com booking sync, official WhatsApp, monitoring/admin.

## Brand Structure

- Parent platform: **Viva**
- Product motions: **Reserva Viva** and **Venta Viva**
- Combined offer: **Viva Platform** or **Viva Suite**
