# Incident Response Runbook

Use this for suspected privacy, security, or PHI incidents. This is an operational runbook, not legal advice.

## Incident Types

- Unauthorized account access.
- Cross-tenant data exposure.
- Lost or leaked credentials.
- Provider webhook abuse or forged webhook events.
- PHI sent to an unapproved provider.
- PHI in logs, metadata, screenshots, demos, or test data.
- Incorrect outbound message to the wrong recipient.
- Deletion/export request mishandled.

## First Hour

1. Assign an incident owner.
2. Record time discovered, reporter, affected tenant, and suspected data.
3. Stop additional exposure:
   - Disable live provider activation.
   - Rotate affected webhook/API secrets.
   - Pause outbound messages.
   - Remove exposed public links/files.
4. Preserve evidence:
   - Do not delete logs needed for investigation.
   - Record screenshots or event IDs.
   - Export relevant platform events.
5. Determine whether legal counsel must lead notification decisions.

## First Day

- Identify affected tenants, users, customers, providers, and data classes.
- Identify root cause and whether PHI/personal data was involved.
- Confirm whether data was actually accessed, acquired, used, disclosed, modified, or deleted.
- Rotate all potentially exposed credentials.
- Patch the defect or disable the feature.
- Record containment and remediation steps.
- Prepare tenant/customer/provider notifications only after legal review.

## Closure

- Document impact, root cause, containment, remediation, notification decision, and follow-up owners.
- Add or update product controls so the same incident cannot recur silently.
- Run a tabletop drill before enabling broader medical launch.

## App Evidence To Capture

- `platform_events` rows.
- `provider_activation_states` for affected providers.
- `webhook_ingest_events` for affected provider events.
- `outbound_messages` review/sent state.
- Related `conversations`, `messages`, `booking_records`, `orders`, and `customers`.
- Privacy requests created or updated during the incident.

