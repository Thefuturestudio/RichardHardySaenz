# Data Model

Step 1 tables:

- `profiles`: one row per Supabase user.
- `tenants`: one row per customer business.
- `tenant_memberships`: user-to-tenant roles: owner, admin, staff.
- `tenant_settings`: runtime business settings for future assistants and workflows.
- `channel_bindings`: provider-agnostic connection records for future voice and WhatsApp providers.

Step 2 tables:

- `catalog_categories`: tenant-owned product/service groupings.
- `catalog_items`: tenant-owned products and services with price, currency, optional image URL, SKU, service duration, inventory, and active state.

Step 3 tables:

- `conversations`: tenant-owned conversation records across voice and WhatsApp, including customer contact fields, status, intent, optional channel binding, and summary.
- `messages`: tenant-owned message/transcript rows linked to conversations. This stores records only; it does not send outbound messages.

Step 4 behavior:

- Channel bindings can be created, edited, and deleted from the dashboard by owners/admins.
- Bindings remain provider-agnostic. They do not activate Unipile, Vapi, WhatsApp Cloud API, 360dialog, or live outbound messaging.

Step 5 tables:

- `whatsapp_beta_sessions`: tenant-owned Unipile beta setup state linked to a WhatsApp `channel_bindings` row. It stores connection method, status, future hosted auth URL, external account ID, phone number, and metadata.
- Current Step 5 creates records and setup status only. It does not call Unipile, generate QR codes, receive webhooks, sync messages, or send outbound WhatsApp messages.

Steps 6-10 foundation tables:

- `voice_beta_sessions`: tenant-owned Vapi voice setup state linked to a voice `channel_bindings` row. It does not create assistants, phone numbers, or calls yet.
- `ai_tool_configs`: draft registry for future controlled AI tools such as catalog search, human handoff, and order drafting. It does not execute tools or call OpenAI yet.
- `orders` and `order_items`: tenant-owned draft commerce records for future carts and payment links. They do not create Stripe links or charges yet.
- `automation_workflows`: draft n8n workflow registry for future owner notifications, follow-up queues, and digests. It does not activate webhooks yet.
- `billing_accounts`: tenant billing placeholder for future Stripe subscriptions. It does not create Stripe customers, subscriptions, checkout sessions, or charges yet.

Step 11 foundation tables:

- `booking_sync_configs`: tenant-owned Cal.com setup state for future booking sync. It does not call Cal.com, create event types, or register webhooks yet.
- `booking_records`: tenant-owned draft booking records for future calendar sync and booking recovery. They are not synced to a calendar yet.

Steps 12-16 foundation tables:

- `official_whatsapp_configs`: tenant-owned official WhatsApp / 360dialog setup state linked to an official WhatsApp `channel_bindings` row. It does not connect to Meta or 360dialog yet.
- `customers`: tenant-owned customer identities shared across conversations, bookings, orders, and future channels.
- `consent_records`: tenant-owned consent state for WhatsApp, voice, email, and SMS. Unknown consent must not be treated as opt-in.
- `compliance_reviews`: activation review records for restricted categories, fallback readiness, and provider go-live approval.
- `provider_activation_states`: controlled go-live state for each provider. `live_enabled` defaults to false.
- `platform_events`: tenant-scoped readiness and monitoring events.
- `data_privacy_requests`: tenant-owned access, export, correction, deletion, restriction, retention review, and incident workflow records for medical privacy operations.

## Tenant Model

Each business is a tenant. Users access tenants through memberships. The platform must not rely only on `owner_user_id`; membership-based access is required from the first migration.

## Future Tables

The following are **NOT YET IMPLEMENTED**: contacts, carts, real payments, live appointments/calendar writes, full audit log retention automation, usage metering.
