# Vapi Integration Notes

The website assistant currently runs as a safe, client-side intake and booking flow.
It uses the shared `IntakeLead` model in `src/types/intake.ts`, which should also be
used by a future Vapi voice assistant so web and voice leads have the same structure.

## Current implementation

Backend endpoints:

- `/.netlify/functions/intake-lead` receives website and assistant form submissions.
- `/.netlify/functions/vapi-chat` sends website text-chat messages to the published Vapi assistant through the Vapi Chat API.
- `/.netlify/functions/vapi-webhook` receives Vapi server events, tool calls, transfer destination requests, and end-of-call reports.
- `/.netlify/functions/whatsapp-webhook` receives inbound WhatsApp messages from Meta Cloud API or Twilio and routes text messages through the same Vapi assistant used by website chat.

Shared backend logic lives in `netlify/functions/intake-core.mjs` so web, WhatsApp handoff, and voice call summaries use the same validation, urgent-language flagging, and staff email delivery rules.

Approved FAQ knowledge from `C:\Users\Rich\Downloads\FAQ - BRUGIATI.docx` is stored in:

- `src/data/assistantFaq.ts` for the website assistant and local fallback.
- `netlify/functions/assistant-faq-knowledge.mjs` for WhatsApp/Vapi server-side routing.
- `src/integrations/vapi/UROPANAMA_FAQ_BRAIN.md` as the source document uploaded into the Vapi assistant Files knowledge area.

Current Vapi dashboard state:

- Assistant: `UroPanama Assistant`
- Assistant ID: `73bc43c1-0cb1-4734-91fd-5bf25230838c`
- Attached knowledge file: `UROPANAMA_FAQ_BRAIN.md`
- Vapi file ID: `834916fc-8539-4ac6-8e09-dfbf952496f4`
- The FAQ was added as context only; the assistant personality/system prompt was verified unchanged after attachment.

## Vapi connection points

- `createLead`: persist an intake lead in a backend, CRM, or secure database.
- `sendStaffNotification`: send a structured staff summary without confirming an appointment.
- `sendWhatsAppSummary`: send or prepare a WhatsApp summary for the practice team.
- `checkAvailability`: request real calendar availability from a verified backend.
- `transferToHuman`: route the patient to WhatsApp, phone, or staff follow-up.

## Tool behavior in this build

- `createLead` validates the caller information and sends a clinic-team notification when `STAFF_NOTIFICATION_EMAIL` and `RESEND_API_KEY` or `EMAIL_PROVIDER_API_KEY` are configured.
- `sendStaffNotification` uses the same lead validator and email delivery path for voice-agent summaries or staff handoff.
- `sendWhatsAppSummary` returns a prepared-summary confirmation only. Automatic WhatsApp sending is intentionally disabled until an approved WhatsApp provider is configured.
- `checkAvailability` always tells the assistant to use manual confirmation or the approved HuliPractice workflow. It must not confirm appointments automatically.
- `transferToHuman` returns `CLINIC_TRANSFER_PHONE` when configured. The assistant should use Vapi's transfer flow for the actual call transfer.
- `end-of-call-report` sends the call summary/transcript to the staff inbox when email delivery is configured.
- `whatsapp-webhook` is live-path ready. It uses `VAPI_PRIVATE_KEY` and `VAPI_ASSISTANT_ID` for the same assistant as the website chat. If Vapi is not configured, it returns a safe Spanish handoff message instead of giving medical advice.
- Website chat and WhatsApp now attach relevant approved FAQ answers to Vapi as `approvedKnowledge` based on the patient message.

## Required environment variables

```bash
STAFF_NOTIFICATION_EMAIL=dr.carlosbrugiati@gmail.com
URGENT_NOTIFICATION_EMAIL=
RESEND_API_KEY=
EMAIL_PROVIDER_API_KEY=
INTAKE_FROM_EMAIL=
ALLOWED_ORIGIN=https://uropanama.com
VITE_VAPI_PUBLIC_KEY=
VITE_VAPI_ASSISTANT_ID=
VAPI_ASSISTANT_ID=
VAPI_PRIVATE_KEY=
VAPI_SERVER_SECRET=
CLINIC_TRANSFER_PHONE=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_GRAPH_VERSION=
```

The website drawer uses `/.netlify/functions/vapi-chat` first so text chat can run through the same published assistant as the voice agent. If `VAPI_PRIVATE_KEY` is not configured on the server, the drawer falls back to the local safe preview copy and labels that state in the UI.

Recommended simple default while waiting for client confirmation:

- Use `STAFF_NOTIFICATION_EMAIL=dr.carlosbrugiati@gmail.com`.
- Leave `URGENT_NOTIFICATION_EMAIL` empty so urgent and routine leads go to the same inbox with a stronger urgent subject line.
- Use Resend for email delivery unless the client prefers another provider.
- Use `+507 6314-5514` as the public patient WhatsApp/phone number.
- Public patient-facing hours are Monday-Friday 12:00 p.m.-6:00 p.m. and Saturday 8:00 a.m.-12:00 p.m., subject to manual availability confirmation.
- Main patient-facing address is The Panama Clinic, Torre B, piso 21, consultorio 10-11. Do not add RUC, Meta verification documents, domain admin access, or provider credentials to public assistant answers.

Ask the client before final activation:

1. Should all website booking, assistant, and voice-call summaries go to `dr.carlosbrugiati@gmail.com`, or is there a separate staff/admin inbox?
2. Should urgent-flagged leads go to the same inbox or a different urgent contact?
3. What phone number should `CLINIC_TRANSFER_PHONE` use for live human transfers?

## WhatsApp activation checklist

The local documents do not include live Meta/WABA credentials, phone-number IDs, or Twilio sender details. Do not request those secrets until the client is ready to configure the selected provider.

1. Confirm provider: Meta WhatsApp Cloud API directly, or Twilio WhatsApp sender/sandbox.
2. For Meta Cloud API, configure the callback URL as `https://uropanama.com/.netlify/functions/whatsapp-webhook`, subscribe to message webhooks, and set `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and the current Meta Graph API version in `WHATSAPP_GRAPH_VERSION`.
3. For Twilio, configure the WhatsApp sender or sandbox inbound message webhook to `https://uropanama.com/.netlify/functions/whatsapp-webhook` using HTTP POST. The endpoint replies with TwiML for inbound user messages.
4. Confirm `VAPI_PRIVATE_KEY` and `VAPI_ASSISTANT_ID` are set in Netlify so WhatsApp, website chat, and voice use the same published assistant.
5. Test from a clinic-controlled WhatsApp number before any public launch. Verify Spanish LatAm responses, no diagnosis, urgent routing, appointment-detail collection, and manual confirmation language.

Current limitation: the webhook keeps the Vapi chat ID in short-lived server memory for warm Netlify invocations. For durable WhatsApp conversation memory across cold starts, add a small secure store such as Netlify Blobs or Supabase keyed by the WhatsApp sender.

## Vapi setup checklist

1. Configure the Vapi assistant ID and public key in environment variables.
2. Set the assistant or phone-number server URL to `https://uropanama.com/.netlify/functions/vapi-webhook`.
3. Validate all incoming tool payloads against the shared `IntakeLead` shape.
4. Configure custom webhook authentication and mirror the value in `VAPI_SERVER_SECRET`.
5. Store only the minimum needed data and follow medical privacy requirements.
6. Keep medical guardrails: no diagnosis, lab interpretation, medication advice, treatment recommendation, or automatic appointment confirmation.

## Ariel safety brief

Ariel should be configured as a patient-access assistant, not a diagnostic agent.
It may explain general possible causes, ask clarifying questions, explain what to
bring to consultation, and collect appointment details. It must not diagnose,
prescribe or change medication, interpret lab values as a final conclusion, make
treatment decisions, or confirm appointment availability automatically.

Urgent escalation language should trigger when a patient mentions fever, severe
pain, blood in urine, inability to urinate, testicular pain, vomiting, chills,
weakness, rapid worsening, or a post-operative concern. In those cases Ariel
should tell the patient to seek urgent medical care and offer to send a staff
summary if contact details are provided.

The website assistant now passes a small approved-knowledge context to
`/.netlify/functions/vapi-chat`. The phone agent should use the same knowledge
themes: first visit, what to bring, HoLEP/BPH, TURP, kidney stones,
ureteroscopy, lithotripsy, PSA, prostate biopsy, vasectomy, erectile
dysfunction, second opinion, uro-oncology, urgent warning signs, and privacy/data
use.

Do not expose API keys in the frontend. The public web assistant can use public Vapi credentials only when the Web SDK is added later; server secrets stay in Netlify environment variables.
