# Medical Privacy and Security Launch Plan

Viva should launch with medical clients allowed, not excluded. The correct control is a medical-grade activation gate: medical, dental, therapy, wellness, med spa, home health, clinics, and other regulated or sensitive categories can sign up, but PHI-capable workflows must stay blocked until the required agreements, provider settings, and internal controls are in place.

This is an engineering and operating plan, not legal advice. A HIPAA/privacy attorney should review the final production setup, BAA stack, privacy policy, terms, incident process, and customer contracts before handling real protected health information.

## Launch Position

- Treat the platform as capable of receiving health data by accident from day one.
- Keep `MEDICAL_PRIVACY_MODE=true` by default in every launch environment.
- Allow all client categories to sign up, including medical categories.
- Put medical and other sensitive categories into manual activation before any live AI, voice, WhatsApp, booking, or payment workflow can process sensitive customer content.
- Do not send PHI to any provider unless the specific provider account, product, region, and workflow are approved for that data.
- Prefer generic operational messages for medical tenants: appointment reminders, intake links, payment links, and follow-up prompts should avoid diagnoses, treatment details, lab results, prescriptions, symptoms, or procedure details unless the channel is cleared for PHI.

## Data Classification

Use these labels when designing fields, prompts, logs, exports, and provider payloads.

| Class | Examples | Default handling |
| --- | --- | --- |
| Public | tenant display name, public service label, public business hours | Normal app controls |
| Business confidential | tenant settings, team notes, catalog pricing, provider credentials metadata | Tenant RLS, admin-only access, no client-side secrets |
| Personal data | names, phone numbers, email addresses, booking IDs, conversation identifiers | Tenant RLS, consent/notice, retention limits, export/delete path |
| Sensitive personal data | health status, symptoms, appointment reason, medical notes, therapy notes, insurance details | Medical privacy gate, minimum necessary, no provider sharing unless approved |
| PHI/ePHI | individually identifiable health information handled for a covered entity or business associate workflow | HIPAA-grade controls, BAAs, audit logging, access review, incident process |
| Secrets | service role keys, provider API keys, webhook secrets, signing secrets | Server-only environment variables, rotation, no logs, no browser exposure |

## Product Rules

1. Signup categories must not block medical clients.
2. Category selection should drive risk tier, not access denial.
3. Medical tenants can use foundation features immediately: auth, tenant profile, catalog setup, manual test data, internal previews.
4. Medical tenants cannot activate live customer-facing workflows until review passes.
5. AI responses in medical contexts must stay administrative: booking, routing, availability, intake collection, reminders, and human handoff.
6. The assistant must not provide diagnosis, treatment recommendations, medication advice, emergency triage, insurance coverage decisions, legal advice, or financial advice.
7. Every medical workflow needs a human fallback and emergency instruction path.
8. All outbound messaging needs consent, opt-out support, and template/policy review where the channel requires it.
9. Payment metadata must not contain medical details. Use opaque order IDs, tenant IDs, and generic item names.
10. Booking metadata must not contain medical details unless the booking provider path is explicitly approved for PHI.

## Required Technical Controls

| Area | Launch control |
| --- | --- |
| Tenant isolation | Supabase RLS on every tenant table; app server uses session clients for tenant operations; service-role client only in server-only admin/webhook paths. |
| Authentication | Supabase Auth; production organization admins must enforce MFA in Supabase and deployment/provider consoles. |
| Authorization | Owners/admins manage launch readiness; members only see tenant-scoped data. Platform owner access must stay explicitly configured and reviewed. |
| Webhooks | Provider webhooks fail closed when secrets are missing; Stripe signatures use raw-body verification; internal simulations use a server-side shared test secret. |
| AI | No shared model training on tenant/customer content; no PHI to OpenAI unless a BAA and eligible service configuration are approved. |
| Messaging | WhatsApp/SMS/voice must use generic content until the exact provider path is cleared for PHI. |
| Payments | Stripe Checkout stays disabled unless an explicit live gate is set; metadata contains only opaque IDs and non-medical descriptors. |
| Booking | Booking sync can store opaque booking IDs and generic appointment state; PHI fields require cleared provider path and retention policy. |
| Logging | Logs and webhook payloads must not store secrets; raw provider payload retention should be short and reviewed. |
| Retention | Default to minimum necessary: raw webhooks/conversation bodies 90 days unless tenant contract requires otherwise; derived operational records can be longer if justified. |
| Export/delete | Build tenant-level export, correction, deletion, and retention actions before broad production rollout. |
| Incident response | Maintain owner, severity, timeline, containment, notification, and postmortem steps; test before launch. |

The dashboard includes a Privacy ops surface at `/dashboard/privacy` for medical go-live approvals, privacy requests, retention reviews, and incident drill evidence.

## Medical Activation Checklist

A medical tenant is production-ready only when each item is true.

- Customer contract and privacy terms define whether Viva is a business associate, processor, or service provider for that tenant.
- Required BAAs are signed for every provider that creates, receives, maintains, or transmits PHI.
- Supabase project is configured as a HIPAA project before storing PHI.
- Deployment provider has the required HIPAA/BAA coverage for the production app.
- MFA is enforced for Supabase, deployment, provider dashboards, and platform admin accounts.
- RLS policies have been tested for cross-tenant reads/writes.
- Provider webhooks are verified and fail closed.
- Live Stripe Checkout is intentionally enabled only after payment metadata review.
- AI provider account has the required BAA/data-retention posture or PHI is excluded before prompts are sent.
- Messaging templates avoid PHI unless the channel is approved for PHI.
- Consent records exist for outbound WhatsApp/SMS/email.
- Human handoff path is visible and tested.
- Emergency language is present where relevant.
- Data retention and export/delete workflow are configured.
- Incident contact and breach-notification workflow are documented.

## Recommended Default Retention

| Data | Default | Notes |
| --- | --- | --- |
| Raw webhook payloads | 30-90 days | Reduce once processing is stable; never log secrets. |
| Conversation message bodies | 90 days for medical tenants | Keep longer only by explicit tenant policy and contract. |
| Conversation summaries/status | 1 year | Keep operational state without raw sensitive details where possible. |
| Booking/order records | 2-7 years depending on legal/accounting need | Keep medical details out of payment metadata. |
| Consent records | Duration of relationship plus legal retention period | Needed to prove opt-in/opt-out history. |
| Security/audit events | 1-6 years depending on compliance posture | Store actor, action, target, timestamp, source, outcome. |

## Source Baseline

- HHS says cloud providers that create, receive, maintain, or transmit ePHI for covered entities or business associates generally require a HIPAA-compliant BAA: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/
- HHS Security Rule requires administrative, physical, and technical safeguards for ePHI confidentiality, integrity, and availability: https://www.hhs.gov/hipaa/for-professionals/security/
- HHS technical safeguard guidance covers access controls, audit controls, integrity, authentication, and transmission security: https://www.hhs.gov/sites/default/files/ocr/privacy/hipaa/administrative/securityrule/techsafeguards.pdf
- Supabase requires a signed BAA and HIPAA add-on for PHI projects: https://supabase.com/docs/guides/platform/hipaa-projects
- Supabase healthcare shared responsibility includes MFA, PITR, SSL enforcement, network restrictions, and no PHI in public buckets: https://supabase.com/docs/guides/deployment/shared-responsibility-model
- Vercel states HIPAA compliance is shared responsibility and references BAAs for eligible customers: https://vercel.com/kb/guide/hipaa-compliance-guide-vercel
- OpenAI says PHI use with the API requires a BAA with OpenAI: https://help.openai.com/en/articles/8660679
- OpenAI platform data controls describe default API training and retention controls: https://platform.openai.com/docs/guides/your-data
- Stripe webhook handling requires HTTPS endpoints and signature verification using the endpoint signing secret: https://docs.stripe.com/webhooks
- WhatsApp Business Messaging Policy governs business messaging use and data obtained through WhatsApp: https://whatsappbusiness.com/policy/
- Panama ANTAI states Law 81 regulates personal data protection principles, rights, obligations, and procedures: https://antai.gob.pa/reglamentan-ley-81-de-proteccion-de-datos-personales/
- FTC security guidance emphasizes minimizing data, sensible access controls, authentication, encryption, logging, and provider oversight: https://www.ftc.gov/business-guidance/resources/start-security-guide-business
