# Google Stitch Design Brief: Viva App

Use this file as the design prompt/reference brief for Google Stitch when generating more Viva App reference imagery. This is for visual exploration only. Do not treat these screens as implemented product scope.

## Product

Viva is a multi-tenant SaaS dashboard by The Future Studio. It has two commercial motions inside one platform:

- Reserva Viva: AI receptionist, missed-call recovery, booking support, and human handoff.
- Venta Viva: WhatsApp sales, catalog support, carts, checkout links, and owner notifications.

The app should feel like a premium, modern operations dashboard for busy business owners, not a chatbot toy and not a marketing landing page.

## Existing References

Use these local references as the visual baseline:

- Screenshot folder: `C:\Users\Rich\Desktop\VivaAppStyling`
- Design system archive: `C:\Users\Rich\Downloads\Viva Design System.zip`
- Project memory: `C:\Users\Rich\Documents\New project 5\docs\DESIGN_REFERENCE.md`

Important reference themes already approved:

- Minimalist SaaS dashboard
- Clean sidebar navigation
- Light and dark dashboard variants
- Premium cards, buttons, badges, forms, empty states, error states
- Operations inbox, channels, onboarding, payments settings, orders, team roles
- Strong typography and confident business-owner copy

## Visual Direction

Create a premium SaaS interface that is:

- Clean, spacious, fast, and practical
- Dashboard-first, not landing-page-first
- Business-owner friendly
- Sophisticated but not decorative
- Clear enough for non-technical users
- Built around daily operations: conversations, bookings, catalog, orders, payments, channels, settings

Avoid:

- Cartoon mascots
- Decorative blobs/orbs
- Overly playful chatbot UI
- Heavy marketing hero layouts
- Excessive gradients
- Overcrowded enterprise software
- Medical, legal, or financial advice imagery

## Brand Feel

Viva should feel like an AI operations employee for small and medium businesses.

Tone:

- Confident
- Direct
- Premium
- Calm
- Operational
- Trustworthy

Preferred words:

- AI Agent
- Operations Inbox
- Booking
- Handoff
- Channels
- Setup Progress
- Owner Notification
- Catalog
- Payment Link

Avoid words:

- Bot
- Chatbot
- Magic
- Fully autonomous without oversight
- Diagnosis
- Legal advice
- Financial advice

## Color Direction

Use the Viva design system as source of truth. Useful tokens:

- Primary accent: `#6A46FF`
- Purple gradient accent: `#5968FF -> #A655F3 -> #FF4D88`
- Light background: `#F8FAFF`
- Light cards: `#FFFFFF`
- Light border: `#E2E8F0`
- Dark background: `#0B0F1A`
- Dark surface: `#111827`
- Dark card: `#1A1F35`
- Success: `#22C55E`
- Warning: `#F59E0B`
- Error: `#EF4444`

Near-term production app should prioritize light mode. Dark mode can be explored as a premium future option.

## Typography

Use modern SaaS typography with strong hierarchy.

Preferred:

- Space Grotesk for Viva App UI if available
- DM Sans as a clean fallback
- Barlow Condensed only for display/brand moments, not dense dashboard body text

Typography should be readable, restrained, and practical. Avoid giant marketing headings inside dashboards.

## Layout Rules

- Sidebar-first dashboard shell
- Clear main content area
- Dense but breathable information layout
- Cards for real grouped information, not decoration
- Buttons should be obvious and action-oriented
- Empty states should explain what is missing and show a clear next action
- Settings forms should feel calm and easy
- Keep rounded corners moderate
- Use icons for navigation and actions

## Screens To Generate

Generate high-quality dashboard reference images for these screens:

1. Overview Dashboard
   - Business name
   - Plan/status
   - Setup progress
   - Human fallback status
   - Future modules as disabled cards
   - Clean owner-focused summary

2. Catalog Management
   - Product and service list
   - Empty state
   - Add product/service form
   - Category filters
   - Active/inactive status
   - Price, duration, and fulfillment notes

3. Operations Inbox
   - Conversation list
   - Customer detail panel
   - AI/human handoff state
   - Urgency/status badges
   - Owner notification preview

4. Channels
   - WhatsApp beta connection placeholder
   - Voice channel placeholder
   - Official WhatsApp API future lane
   - Provider-agnostic connection cards
   - Clear "not connected" and "coming later" states

5. Onboarding
   - Business profile setup
   - Business type
   - Location/timezone
   - Language
   - Human fallback number
   - Friendly but professional setup progress

6. Settings
   - Business profile
   - Language/tone/greeting
   - Human fallback number
   - Booking URL
   - Save state and validation messages

7. Orders And Payment Links
   - Future-state design only
   - Order request cards
   - Payment status
   - Owner payout/notification concept
   - No real Stripe implementation shown as live

8. Team Roles
   - Owner/admin/staff roles
   - Simple permissions table
   - Invite member empty state

## Main Stitch Prompt

Design a premium SaaS dashboard for Viva, an AI operations platform by The Future Studio. Viva helps businesses manage bookings, conversations, product sales, handoffs, channels, and setup from one clean multi-tenant dashboard. The visual style should match a modern Vercel-quality SaaS product: minimal, polished, spacious, responsive, business-owner friendly, and operational. Use a light dashboard as the primary version with white cards, soft blue-white background, subtle borders, clean typography, and a refined purple accent. Include a fixed left sidebar, clear page heading, action buttons, status badges, setup progress, empty states, and future modules marked as coming soon. Avoid decorative clutter, cartoon chatbot styling, and marketing hero layouts.

## Optional Dark Mode Prompt

Create a dark premium version of the Viva dashboard using near-black navy backgrounds, elevated dark cards, subtle borders, and controlled purple/indigo accents. Keep it readable, professional, and operational. The dark version should feel like a premium command center, not a gaming UI.

## Image Output Checklist

For each generated reference image, check:

- Does it look like a real SaaS product?
- Can a business owner understand what to do next?
- Is the dashboard practical, not decorative?
- Are buttons, inputs, cards, badges, and sidebars consistent?
- Does it preserve Viva as one multi-tenant platform?
- Are future modules clearly marked as future/not connected when needed?
- Does it avoid overpromising full automation without human fallback?

## Notes For Future Codex Work

- These Stitch images are references only.
- Do not implement WhatsApp, Vapi, AI, Stripe, n8n, Cal.com, catalog, orders, or automations unless the user explicitly starts that build step.
- When the user asks for styling, first read `docs/DESIGN_REFERENCE.md` and this file.
- Keep implementation scoped to the requested step.

