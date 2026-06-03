# Data Retention and Privacy Requests

Viva should collect the minimum data needed to run tenant workflows. For medical tenants, default to shorter raw-content retention unless a customer contract requires otherwise.

## Default Retention Targets

| Data | Target |
| --- | --- |
| Raw webhook payloads | 30-90 days |
| Raw conversation/message bodies | 90 days for medical tenants |
| Conversation status and summaries | 1 year |
| Booking/order records | Contract/legal/accounting period |
| Consent records | Relationship duration plus legal retention period |
| Platform audit/security events | 1-6 years depending on compliance posture |
| Test/demo records | Archive before launch; do not use real patient data |

## Request Types

- Access: find data linked to a person.
- Export: produce a structured copy for review.
- Correction: record a requested data correction.
- Deletion: remove or de-identify data where legally allowed.
- Restriction: pause processing or outbound contact.
- Retention review: confirm old data still has a reason to exist.
- Incident: track privacy/security investigation items.

## Safe Deletion Approach

Do not immediately hard-delete medical records from the UI. First:

1. Create a privacy request.
2. Identify all records by customer ID, phone, email, provider IDs, and conversation IDs.
3. Confirm legal/accounting retention requirements.
4. De-identify unnecessary operational records where possible.
5. Preserve audit records that are required to prove request handling.
6. Record completion, rejection, or legal hold notes.

## Launch Requirement

Before broad medical launch, the app must have:

- A privacy operations page.
- Request tracking table.
- Owner/admin-only status updates.
- Retention review logging.
- Export/delete runbook.
- Incident drill record.

