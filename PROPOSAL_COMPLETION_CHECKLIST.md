# Brugiati Website Proposal Completion Checklist

Use this checklist to finish the approved website proposal. If a task requires information we do not have, mark it as `Blocked - needs client info` and move to the next unblocked website task.

## Current Project

- Website folder: `C:\Users\Rich\Desktop\BrugiatiWebsite`
- Local preview: `http://127.0.0.1:5174/`
- Production target in proposal: `https://uropanama.com`
- Approved proposal source: `Brugiati_Propuesta_APROBADA_TheFutureStudio.pdf`

## Working Rule

- Finish visible website work first.
- Do not publish unverified testimonials, credentials, review claims, insurance claims, addresses, locations, or affiliations.
- Do not ask for credentials until the client is ready to configure the chosen provider.
- If information is missing, skip that item and continue with the next website-completion item.

## 1. Website Content And SEO

- [x] Multi-page custom React/Vite website exists.
- [x] Main specialty and procedure pages exist.
- [x] Blog menu item exists.
- [x] Blog/education index exists.
- [x] 9 SEO education articles exist.
- [x] Article pages include visible FAQ and related-article sections.
- [x] Sitemap includes the blog and article routes.
- [x] Final polish all article text for medical Spanish, accents, and natural patient language.
- [x] Spot-check all article links and related procedure CTAs.
- [x] Review all page titles and meta descriptions for target keywords.
- [x] Confirm every public procedure route has schema and canonical metadata.
- [x] Run a full route smoke test for every live route.

## 2. Design, Images, And Mobile QA

- [x] Header includes Blog.
- [x] Header spacing optimized after adding Blog.
- [x] Previous logo restored using a cropped usable logo asset.
- [x] Blog hero image changed to a more education-appropriate consultation/studies image.
- [x] Audit mobile and tablet layouts at 375, 414, 768, 1024, 1280, and 1366 widths.
- [x] Check hero image face placement on home, blog, specialties, procedures, booking, and priority procedure pages.
- [x] Confirm sticky/floating CTA does not overlap important content on checked article and blog views.
- [x] Confirm no generated-image artifacts or fake text are visible in key crops.
- [x] Run one final visual pass on all high-priority routes.

## 3. Trust, Cases, Testimonials, And Achievements

- [ ] Add gallery/cases section only if client provides publishable material.
- [ ] Add testimonials only if sourced from public/approved reviews.
- [ ] Add achievements/logros only if verified by the client.
- [ ] Confirm whether public review count/rating can be shown.
- [ ] Confirm hospitals, affiliations, memberships, awards, and insurance statements before final publication.

Blocked until client provides verified source material:

- Testimonials/reviews.
- Case gallery.
- Achievements/logros.
- Insurance details.
- Final hospital/clinic location claims.

## 4. Booking Form And Website Assistant

- [x] Booking form exists.
- [x] Website assistant UI exists.
- [x] Shared `IntakeLead` model exists.
- [x] Netlify intake endpoint exists.
- [x] Urgent language detection exists.
- [x] WhatsApp fallback exists.
- [x] Approved FAQ brain from `FAQ - BRUGIATI.docx` is wired into website assistant knowledge.
- [ ] Confirm final staff/admin notification email.
- [ ] Configure email provider: Resend, SendGrid, SMTP, or another approved provider.
- [ ] Add production environment variables.
- [ ] Test booking form lead delivery.
- [ ] Test assistant lead delivery.
- [ ] Confirm success/error copy is clear and does not imply automatic appointment confirmation.
- [ ] Confirm urgent-flagged messages go to the correct destination.

Blocked until client confirms:

- Staff/admin notification email.
- Urgent escalation destination.
- Preferred email provider if not using Resend.
- Whether HuliPractice remains manual scheduling.

## 5. WhatsApp Agent

- [x] Phase-one WhatsApp `wa.me` fallback exists.
- [x] Backend WhatsApp webhook scaffold exists for Meta Cloud API and Twilio inbound messages.
- [x] WhatsApp text messages route through the same Vapi assistant when server Vapi credentials are configured.
- [x] WhatsApp inbound messages can attach relevant approved FAQ answers to Vapi.
- [ ] Confirm whether client has Meta Business / WABA access.
- [ ] Confirm WhatsApp number to use for Cloud API.
- [ ] Decide whether WhatsApp automation is phase one or post-launch.
- [ ] If approved, configure live WhatsApp provider environment variables.
- [ ] Test WhatsApp assistant flow with clinic team.

Blocked until client provides:

- Meta/WABA status.
- WhatsApp Cloud API access.
- Approved WhatsApp number and templates if required.
- Production WhatsApp verify token, access token, and phone-number ID if Meta is selected.

## 6. Vapi Phone Receptionist

- [x] Vapi notes and environment placeholders exist.
- [x] Create/configure Vapi assistant.
- [x] Attach approved FAQ brain to the Vapi assistant Files knowledge area.
- [ ] Add Vapi public key and assistant ID.
- [ ] Add backend webhook endpoint for Vapi tool calls.
- [ ] Implement tool handling for `createLead`, `sendStaffNotification`, `checkAvailability`, and `transferToHuman`.
- [ ] Add post-call summary handling.
- [ ] Test inbound/forwarded phone flow.
- [ ] Test urgent escalation wording.
- [ ] Train client/team on call summary review.

Blocked until available:

- Vapi account access.
- Vapi assistant ID.
- Vapi public web key.
- Vapi server secret.
- Phone number/forwarding decision.
- Staff escalation rules.

## 7. Legal, Privacy, And Safety

- [x] General medical safety language exists.
- [x] No diagnosis/treatment promise rule is reflected in copy.
- [ ] Finalize privacy page for forms, WhatsApp, assistant, Vapi calls, transcripts/summaries, and retention.
- [ ] Finalize terms page.
- [ ] Confirm consent language with client.
- [x] Confirm no sensitive document upload is enabled before secure workflow exists.
- [x] Review all AI assistant copy for medical safety.

Blocked until client/legal review:

- Final privacy policy.
- Final terms.
- Data retention policy.
- Call recording/transcript consent language.

## 8. Analytics And Search Console

- [ ] Choose analytics provider.
- [ ] Add production analytics without capturing PHI.
- [ ] Track booking clicks, WhatsApp clicks, assistant opens, form submissions, language toggles, and article engagement.
- [x] Verify `robots.txt`.
- [ ] Submit sitemap in Google Search Console after production deployment.
- [ ] Run rich-result tests after deployment.

Blocked until client confirms:

- Analytics provider.
- Google account/Search Console access.
- Any ad/pixel requirements.

## 9. Deployment And Launch QA

- [ ] Confirm production domain DNS for `uropanama.com`.
- [ ] Configure production environment variables.
- [ ] Deploy to production.
- [ ] Test all critical routes in production.
- [ ] Test booking form in production.
- [ ] Test assistant in production.
- [ ] Test WhatsApp links in production.
- [ ] Test mobile layouts on a real phone.
- [ ] Run Lighthouse/PageSpeed.
- [ ] Run link check.
- [ ] Final client review.
- [ ] Final handoff/training session.

## Suggested Next Unblocked Website Tasks

1. Final article copy polish and link check.
2. Review all page titles and meta descriptions for target keywords.
3. Privacy/terms draft pass with placeholder-free language.
4. Prepare client info request for blocked integration items.
5. Production deployment and launch QA once domain/environment details are available.

## Latest Verification

- 2026-05-18: Full public route smoke test passed, including home, specialties, procedures, booking, blog, all 9 article routes, legal pages, and `/404`.
- 2026-05-18: Production build passed with `npm run build`.
- 2026-05-18: Responsive audit covered 375, 414, 768, 1024, 1280, and 1366 widths on key routes with no horizontal overflow detected.
- 2026-05-18: In-app preview visual check confirmed the blog index and HoLEP article render correctly after the Blog/header changes.
- 2026-05-18: Article copy accent/polish sweep completed for the education data and homepage education preview.
- 2026-05-18: Internal article/procedure route spot check passed, and all checked public routes returned 200.
- 2026-05-18: SEO metadata and schema coverage checked for public pages, procedure pages, and education articles.
- 2026-05-18: Encoding scan passed with no mojibake markers found in `src` or `public`.
- 2026-05-18: Privacy and terms draft strengthened for forms, WhatsApp, assistant, Vapi/voice summaries, transcripts, retention, human review, and no sensitive uploads.
- 2026-05-18: Unverified hospital and insurer logo/name claims were removed from the visible homepage access section; coverage is now framed as manual confirmation until the client verifies publishable details.
- 2026-05-18: Final visual QA found and fixed mobile hero clipping on booking, procedure, and article pages by tightening the shared `PageHero` mobile layout.
- 2026-05-18: Post-fix mobile screenshots confirmed booking and HoLEP article heroes wrap correctly with no horizontal overflow in the in-app preview.
- 2026-05-18: Assistant safety copy reviewed for no diagnosis, no automatic appointment confirmation, and urgent-care escalation language.
- 2026-05-18: `robots.txt` verified and points to `https://uropanama.com/sitemap.xml`.
- 2026-05-19: WhatsApp webhook scaffold added. It can receive Meta Cloud API or Twilio inbound WhatsApp messages, route text through the same Vapi assistant, return a safe fallback if Vapi is not configured, and send Meta replies once production WhatsApp environment variables are provided.
- 2026-05-20: `FAQ - BRUGIATI.docx` was extracted into a 157-answer approved FAQ brain, wired into website assistant context, local fallback replies, and WhatsApp/Vapi server-side context. A Vapi-ready source document was saved at `src/integrations/vapi/UROPANAMA_FAQ_BRAIN.md`.
- 2026-05-20: Vapi assistant `UroPanama Assistant` (`73bc43c1-0cb1-4734-91fd-5bf25230838c`) now has `UROPANAMA_FAQ_BRAIN.md` attached as its only Files knowledge source. Personality/system prompt verification stayed unchanged after attachment.
