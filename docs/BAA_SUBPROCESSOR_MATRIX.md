# BAA and Subprocessor Matrix

This matrix is the launch gate for providers that may touch personal data, sensitive data, or PHI. "PHI allowed" means allowed only after the listed agreement, provider account setting, and workflow review are complete.

| Provider / system | Data touched | PHI allowed at launch? | Required launch control | Current app note |
| --- | --- | --- | --- | --- |
| Supabase Auth/Postgres | Users, tenants, customers, conversations, orders, booking records, webhook payloads | Yes, after BAA/HIPAA project setup | Signed Supabase BAA, HIPAA add-on, High Compliance project, MFA, PITR, SSL enforcement, network restrictions, no PHI in public buckets | Primary datastore. RLS is the core tenant boundary. |
| Vercel / app hosting | Server-rendered app traffic, API routes, webhook routes, logs | Yes, only after eligible BAA/account review | Confirm Vercel BAA and project settings; reduce sensitive logs; lock deployment access with MFA | Production host must be covered before PHI flows through API routes. |
| OpenAI API | Prompts, tool inputs, model outputs, summaries | Yes, only after OpenAI BAA and eligible endpoint/data-retention review | BAA approval, no model training opt-in, use lowest-retention eligible APIs, avoid Web Search for PHI, strip unnecessary identifiers | Current docs mention future AI. Keep PHI out until approved. |
| Vapi / voice layer | Call audio, transcripts, caller IDs, AI prompts | No until voice BAA path is verified | Confirm Vapi BAA/HIPAA posture and all downstream providers for speech, transcription, storage, and LLM routing | Voice lane exists as readiness only. |
| Deepgram / transcription | Audio and transcripts | No until BAA path is verified | Confirm BAA and retention controls; avoid PHI audio until approved | Future provider referenced in architecture docs. |
| ElevenLabs / voice synthesis | Text to speech inputs, generated audio | No until BAA path is verified | Confirm BAA and retention controls; do not send PHI to TTS | Future provider referenced in architecture docs. |
| Twilio | SMS/voice/WhatsApp data depending on channel | Yes, only for HIPAA-eligible products/accounts | Security or Enterprise Edition, Twilio BAA, HIPAA-eligible products only, architecture review | Twilio may be a stronger medical messaging option than unclear BSP paths, but product eligibility must be checked. |
| WhatsApp Business Platform / Meta | WhatsApp identifiers, message content, media | No PHI by default | Use generic appointment/admin messages unless counsel and provider path clear PHI; follow WhatsApp Business Messaging Policy and opt-in rules | WhatsApp can support medical admin messaging, but do not place diagnosis/treatment details in messages by default. |
| 360dialog / official WhatsApp BSP | WhatsApp account/config/message data | No until BAA/HIPAA posture is verified | Confirm BSP data processing and BAA posture; use generic content until cleared | Official WhatsApp lane exists as configuration readiness. |
| Unipile | WhatsApp beta account/message data | No | Beta/testing only; do not process PHI or sensitive medical content through Unipile unless legal/provider review approves it | Current webhook route can create conversations from inbound content, so medical tenants must not use it live until cleared. |
| Cal.com | Booking IDs, attendee info, scheduling metadata | Yes, after BAA/account review | Confirm Cal.com HIPAA/BAA arrangement, use OAuth where possible, avoid appointment reasons/clinical notes in metadata unless cleared | Booking sync should use opaque booking IDs and generic status. |
| Stripe | Checkout sessions, payment metadata, order IDs | Avoid PHI | Do not put diagnosis, treatment, procedure, appointment reason, or sensitive details in metadata/descriptions; use opaque IDs | Live checkout now requires an explicit launch gate. |
| n8n | Automation payloads and workflow logs | No until hosting/provider path is verified | Self-host in covered environment or confirm provider BAA; scrub logs and payloads | Future automation hook only. |
| Internal platform logs/events | Actor, action, status, provider payload summaries | Yes, if minimized and access controlled | Keep audit logs; avoid raw PHI where possible; redact secrets; set retention | `platform_events` and webhook payload storage need retention controls before broad rollout. |

## Approval Record

Before any provider is moved to "PHI allowed", record:

- Provider name and product/service name.
- Account/org/workspace covered by the agreement.
- Signed BAA or contractual basis location.
- Data categories approved.
- Regions/residency settings.
- Retention settings.
- Logging/redaction settings.
- Owner who approved the workflow.
- Date reviewed and next review date.
- Test evidence that the app sends only approved fields.

## Default Safe Payload Rules

- Use `tenant_id`, `order_id`, `booking_id`, and provider object IDs instead of names or health details.
- Use generic item labels such as "Appointment deposit" instead of clinical/procedure names where payment processors are involved.
- Use generic reminders such as "You have an appointment with [clinic]" instead of reason, diagnosis, medication, or result details.
- Do not include PHI in webhook URLs, query strings, metadata, analytics events, logs, or error messages.
- Do not use real patient/customer data in development, testing, demos, screenshots, or training.
