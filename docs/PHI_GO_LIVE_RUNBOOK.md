# PHI Go-Live Runbook

This runbook turns the legal and operational requirements into launch tasks. Use it before any real medical tenant sends customer/patient content through Viva.

## What Codex Can Do

- Add product gates, checklists, dashboards, migrations, and audit records.
- Draft the BAA/subprocessor packet and provider review checklist.
- Keep live provider actions disabled until explicit environment and review gates are present.
- Build privacy request tracking, retention review logging, and incident drill records.
- Prepare the exact console checklist for Supabase, hosting, AI, messaging, voice, booking, and payment providers.

## What Requires A Human Owner

- Sign BAAs and customer contracts.
- Confirm legal role: business associate, processor, controller, or service provider.
- Enable paid HIPAA/security add-ons in provider consoles.
- Enforce MFA in Supabase, Vercel, Stripe, OpenAI, Cal.com, Twilio/WhatsApp/BSP, and email/admin accounts.
- Approve any live PHI workflow after legal and provider review.
- Approve incident notices and legal response decisions.

## Launch Order

1. **Keep safe mode on**
   - `MEDICAL_PRIVACY_MODE=true`
   - `ENABLE_LIVE_STRIPE_CHECKOUT=false`
   - Provider activation rows stay `live_enabled=false`.

2. **Prepare legal packet**
   - Customer agreement or DPA.
   - BAA when the customer is a covered entity or business associate and Viva handles PHI.
   - Subprocessor list from `/docs/BAA_SUBPROCESSOR_MATRIX.md`.
   - Privacy policy and terms covering appointment, messaging, voice, AI, booking, billing, retention, and support data.

3. **Approve infrastructure**
   - Supabase HIPAA project and BAA are complete.
   - Hosting/deployment BAA and account configuration are complete.
   - Production logs do not store secrets or unnecessary PHI.
   - MFA is enforced for owner/admin/provider accounts.

4. **Approve each provider path**
   - Provider has BAA/HIPAA eligibility where PHI may flow.
   - Payload fields are reviewed and use opaque IDs where possible.
   - Retention and logging settings are configured.
   - Webhooks are signed and tested.
   - Test mode passed before live mode.

5. **Approve medical tenant activation**
   - Human fallback is set.
   - Emergency and regulated-advice boundaries are documented.
   - Consent posture is reviewed.
   - Outbound templates avoid PHI unless channel is cleared.
   - Privacy request workflow is ready.
   - Incident response owner and drill are recorded.

6. **Run a limited pilot**
   - Use one medical tenant.
   - Use generic messaging first.
   - Keep AI administrative only.
   - Review logs daily.
   - Do not expand until support, retention, and incident paths have been exercised.

## Minimum Provider Approval Evidence

For each provider, record:

- Agreement or BAA location.
- Account/workspace/project covered.
- Product features approved.
- Data categories approved.
- Regions and retention settings.
- MFA status.
- Logging/redaction status.
- Test evidence.
- Owner approval and date.

## Go/No-Go

Go-live is blocked if any of these are true:

- Medical privacy mode is off.
- Any PHI-touching provider lacks BAA/account approval.
- Supabase is not configured as a HIPAA project for PHI.
- Hosting/deployment path is not approved for PHI.
- MFA is not enforced for owner/admin/provider accounts.
- Webhooks are not signed or fail closed.
- Retention/export/delete workflow is not ready.
- Incident response owner/process is not ready.
- Human fallback is missing.
- The workflow gives diagnosis, treatment, emergency triage, medication, insurance, legal, or financial advice.

