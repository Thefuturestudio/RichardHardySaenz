# Compliance

Viva is business automation, not a general AI chatbot.

## WhatsApp AI Boundary

As of the 2026 WhatsApp Business Solution Terms, Viva must not offer a general-purpose AI assistant through WhatsApp. AI may be used only as an incidental or ancillary tool inside tenant-specific business workflows such as support, bookings, product guidance, order tracking, notifications, and sales. See `/docs/WHATSAPP_AI_RESPONDIO_RESEARCH.md`.

## Required Principles

- Every tenant must have a human fallback path.
- WhatsApp outbound follow-ups require opt-in and approved templates when outside the customer-service window.
- Medical, dental, wellness, therapy, and other regulated categories are allowed to sign up, but must be reviewed before PHI-capable activation.
- Do not build outbound messaging in the current Step 1-5 foundation.
- Do not train shared models on tenant or customer message data.
- Avoid medical, legal, financial, insurance, or other regulated advice.
- Store only data required for operations.

## Activation Policy

Low-risk businesses may eventually auto-activate after setup and testing. Risky or regulated categories should enter manual review. Medical categories must not be rejected by category alone; they should move through the medical privacy gate in `/docs/MEDICAL_PRIVACY_SECURITY_PLAN.md` and the provider review in `/docs/BAA_SUBPROCESSOR_MATRIX.md`.
