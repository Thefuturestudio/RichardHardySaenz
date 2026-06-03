---
version: alpha
name: Viva App Design System
description: Design source of truth for Viva, The Future Studio's multi-tenant SaaS dashboard for Reserva Viva, Venta Viva, and Viva Med.
colors:
  primary: "#3D46FF"
  primary-light: "#6B70FF"
  primary-dark: "#2530D9"
  gradient-start: "#14D7E4"
  gradient-mid: "#146FFF"
  gradient-end: "#FF2DD6"
  accent-teal: "#14D7E4"
  accent-blue: "#146FFF"
  accent-pink: "#E12DEC"
  accent-indigo: "#4B4FBF"
  accent-cyan: "#00B4D8"
  accent-sunrise: "#FF8C42"
  success: "#22C55E"
  warning: "#F59E0B"
  error: "#EF4444"
  info: "#3B82F6"
  neutral-900: "#0B0F1A"
  neutral-800: "#111827"
  neutral-700: "#1E2235"
  neutral-600: "#2D3450"
  neutral-500: "#3E4A6B"
  neutral-400: "#64748B"
  neutral-300: "#94A3B8"
  neutral-200: "#CBD5E1"
  neutral-100: "#E2E8F0"
  neutral-50: "#F1F5F9"
  white: "#FFFFFF"
  light-bg: "#F8FAFF"
  light-surface: "#FFFFFF"
  light-elevated: "#F1F5F9"
  light-text: "#0B0F1A"
  light-text-secondary: "#374151"
  light-text-muted: "#64748B"
  light-border: "#E2E8F0"
  dark-bg: "#050912"
  dark-surface: "#070D1C"
  dark-card: "#0A1122"
  dark-elevated: "#10182D"
  dark-text: "#F1F5F9"
  dark-text-secondary: "#CBD5E1"
  dark-text-muted: "#94A3B8"
  tfs-cream: "#FFF8F5"
  tfs-black: "#0A0A0A"
  tfs-cyan: "#00E5CC"
  tfs-violet: "#9B59FF"
typography:
  h1:
    fontFamily: Intra / Inter
    fontSize: 48px
    fontWeight: 700
    lineHeight: 56px
    letterSpacing: 0
  h2:
    fontFamily: Intra / Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 36px
    letterSpacing: 0
  h3:
    fontFamily: Intra / Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: 0
  h4:
    fontFamily: Intra / Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0
  subtitle:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0
  body:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: 0
  small:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0
  label:
    fontFamily: Intra / Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0
rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 40px
  3xl: 48px
  4xl: 64px
  5xl: 80px
  6xl: 96px
components:
  app-shell:
    backgroundColor: "{colors.light-bg}"
    textColor: "{colors.light-text}"
    sidebarWidth: 240px
    collapsedSidebarWidth: 64px
  sidebar:
    backgroundColor: "{colors.light-surface}"
    borderColor: "{colors.light-border}"
    activeBackground: "{colors.primary}"
    activeTextColor: "{colors.white}"
    rounded: "{rounded.md}"
  button-primary:
    backgroundColor: "{colors.primary}"
    gradient: "linear-gradient(110deg, #14D7E4 0%, #146FFF 36%, #3D46FF 68%, #E12DEC 100%)"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    height: 40px
    padding: "0 20px"
  button-secondary:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-text-secondary}"
    borderColor: "{colors.light-border}"
    rounded: "{rounded.md}"
    height: 40px
    padding: "0 20px"
  card:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-text}"
    borderColor: "{colors.light-border}"
    rounded: "{rounded.lg}"
    padding: 24px
  input:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-text}"
    borderColor: "{colors.light-border}"
    focusColor: "{colors.primary}"
    rounded: "{rounded.md}"
    height: 44px
  badge:
    rounded: "{rounded.full}"
    padding: "3px 10px"
    typography: "{typography.small}"
  nav:
    typography: "{typography.body}"
    iconSize: 20px
    itemHeight: 40px
---

# Viva App Design System

## Overview

Viva is a premium operations dashboard for The Future Studio. It supports two commercial motions and one medical vertical inside one multi-tenant SaaS product: Reserva Viva for bookings, receptionist workflows, and human handoff; Venta Viva for chat sales, catalog support, carts, checkout links, and owner notifications; and Viva Med for medical appointment operations, safe patient handoff, privacy operations, and PHI launch gates.

This `DESIGN.md` is the source of truth before any visual implementation. It is based on the Viva Design System ZIP, the `VivaAppStyling` reference screenshots, and the current project memory. It should guide future styling, component decisions, and design QA. It does not expand product scope by itself.

The visual north star is a calm, premium, Vercel-quality SaaS dashboard for busy business owners. Viva should feel like an AI operations employee, not a chatbot toy, not a generic admin panel, and not a marketing landing page.

Current implementation note: the Step 1 app now uses this system for light/dark theme variables, Intra/Inter display typography and DM Sans body typography, animated gradient actions, glass cards, themed forms, the sidebar shell, auth pages, onboarding, dashboard overview, settings, and coming-soon states. The auth page follows the May 1 login reference: a left glass login card, the Viva lockup inside the card, icon inputs, a filled cyan-blue-violet-magenta gradient CTA, a right-side "Attention that Converts" value proposition with gradient "Converts", and a compact feature row. Auth ambient blobs follow pointer movement in both light and dark modes. Input focus states, CTA hover states, the underline, and the "Converts" word all use the same action gradient. The logo ball is part of the static uploaded logo asset only; there is no separate ball animation.

Primary references:

- `C:\Users\Rich\Downloads\Viva Design System.zip`
- `C:\Users\Rich\Desktop\VivaAppStyling`
- `C:\Users\Rich\Desktop\VivaApp\VivaLogo\ChatGPT Image May 1, 2026, 06_27_48 PM.png`
- `C:\Users\Rich\Documents\New project 5\docs\DESIGN_REFERENCE.md`
- `C:\Users\Rich\Documents\New project 5\docs\GOOGLE_STITCH_DESIGN_BRIEF.md`

## Colors

Use the Viva App palette as the product UI system. The production app supports both light and dark modes.

Light mode:

- Page background: `light-bg` `#F8FAFF`
- Main cards: `light-surface` `#FFFFFF`
- Secondary surfaces: `light-elevated` `#F1F5F9`
- Text: `light-text` `#0B0F1A`
- Secondary text: `light-text-secondary` `#374151`
- Muted text: `light-text-muted` `#64748B`
- Borders: `light-border` `#E2E8F0`

Accent system:

- Use `primary` `#3D46FF` for active states, focus rings, selected nav, and important controls.
- Use the Viva gradient for primary actions, the "Converts" auth headline word, and important AI/status moments.
- Use semantic colors consistently: green success, amber warning, red error, blue info, purple handoff/AI.
- Avoid a one-note purple interface. Purple is the accent, not the whole product.

Dark mode:

- Use `dark-bg`, `dark-surface`, `dark-card`, subtle borders, and controlled gradient accents.
- Dark UI should feel like a professional command center, not gaming software.

TFS colors:

- TFS cream/cyan/violet assets belong mainly to agency/brand surfaces. They can appear in brand moments but should not override Viva App dashboard tokens.

## Typography

Viva App typography should feel modern, confident, and operational.

- Preferred UI display font: Intra / Inter.
- Preferred body fallback from the ZIP: DM Sans.
- Use Barlow Condensed only for TFS/brand display moments, not dense app screens.
- Keep dashboard headings practical. Do not use oversized marketing type inside app panels.
- Keep letter spacing at `0` in implementation.
- Do not scale font size directly with viewport width.

Scale:

- H1: 48px / 56px / 700 for page-level titles only.
- H2: 28px / 36px / 600 for major sections.
- H3: 20px / 28px / 600 for sub-sections.
- H4: 16px / 24px / 600 for card titles.
- Body: 14px / 22px for dashboard text.
- Small: 12px / 16px for metadata, hints, timestamps, and compact labels.

Copy should be direct and business-owner focused. Say "AI Agent", "Operations Inbox", "Booking", "Handoff", "Channels", "Catalog", and "Owner Notification". Avoid "chatbot", "magic", or anything that implies unchecked autonomy.

## Layout

Viva is dashboard-first.

- Use a fixed left sidebar for authenticated app screens.
- The main content area should be spacious, scannable, and task-oriented.
- Keep repeated dashboard modules in cards, but do not nest cards inside cards.
- Prefer full-width page structure with constrained content rather than decorative floating sections.
- Use clear page titles, short supporting copy, and one obvious primary action where needed.
- Empty states should state what is missing and offer the next setup action.
- Coming-soon modules should look intentionally disabled, not broken.
- Settings pages should feel calm, with clear field grouping and validation.

Responsive behavior:

- Desktop: sidebar plus broad content grid.
- Tablet: sidebar may collapse or become compact.
- Mobile: navigation may stack or become a drawer; content should become single-column.
- Fixed-format UI elements should have stable dimensions so hover states, icons, labels, and dynamic content do not shift layout.

## Elevation & Depth

Use quiet depth. The interface should feel premium through spacing, hierarchy, and contrast rather than heavy shadows.

Light mode:

- Cards use white background, `#E2E8F0` borders, 12px radius, and very soft shadows.
- Prefer subtle borders over dramatic shadow.
- Hover states may brighten border and add slight lift, but should stay restrained.

Dark mode:

- Cards use `#1A1F35`, subtle white borders, and controlled ambient shadow.
- Purple glow is reserved for active AI/status elements and key CTAs.

Overlays:

- Modals and dropdowns may use frosted glass or subtle blur where appropriate.
- Do not add decorative blurred orbs, bokeh blobs, or unrelated atmospheric effects to the app.

## Shapes

The Viva App uses moderate radius:

- 4px: tiny elements and tight controls.
- 6px: small buttons, tags, compact controls.
- 8px: standard buttons, inputs, nav items, icon buttons.
- 12px: cards and standard panels.
- 16px: larger panels or elevated modules.
- 24px: rare large surfaces only.
- 9999px: badges, pills, avatars, toggles.

Keep cards at 12px unless an existing component pattern requires otherwise. Avoid excessively round SaaS cards.

## Components

### App Shell

The shell contains a left sidebar, main content area, and optional topbar/search area in future screens. Current Step 1 screens should stay simple, but future modules should share the same primitives.

Sidebar:

- Width: 240px desktop, 64px collapsed.
- Use Viva logo/mark at the top.
- Group navigation by task when the app grows.
- Active nav item uses the primary accent or a controlled gradient.
- Icons should use a 2px outline style, preferably Lucide when implemented.
- Minimum tap target: 44px.

### Buttons

Use icons inside buttons where the action benefits from a familiar symbol.

- Primary: important create/save/connect actions.
- Secondary: alternate actions.
- Ghost: low-emphasis actions.
- Danger: destructive or disconnect actions.
- Success: confirmation-only states, not general CTAs.

Button heights:

- Small: 32px
- Default: 40px
- Large: 48px

Primary buttons may use the Viva gradient. Do not use gradient buttons everywhere.

### Cards

Use cards for real grouped information:

- Stat cards
- Setup checklist panels
- Future module cards
- Channel/provider cards
- Catalog product/service rows
- Operations Inbox detail panels

Cards should not be used as decorative page wrappers, and cards should not be nested inside other cards.

### Inputs

Inputs should be calm, readable, and consistent:

- 44px minimum height for standard fields.
- 8px radius.
- Clear labels above fields.
- Focus ring uses primary purple at low opacity.
- Error state uses red border plus useful text.
- Success state is only used when confirmation is meaningful.

### Badges And Chips

Badges communicate state:

- Confirmed: success
- Pending: warning
- Urgent: error
- Booking: info
- Handoff: purple
- Cancelled/disabled: neutral
- Live: success with dot

Filter chips may use pill shapes. Keep badge text short.

### Icons

Use an outline icon style:

- 2px stroke
- Rounded joins
- 20px default size inside app controls
- 24px where the icon is standalone

The spark/star mark is Viva's signature AI/brand cue. Use it sparingly for AI features, logo moments, or automation status.

### Empty, Error, And Disabled States

Empty states should be useful:

- Short title
- One sentence of context
- One clear next action where possible

Error states should be plain and actionable. Avoid alarming language unless data or payment safety is involved.

Disabled/future states should say "Coming soon" or "Not yet implemented" and should not look clickable unless there is a waitlist or learn-more action.

## Do's and Don'ts

Do:

- Use this file before any UI or styling work.
- Keep Viva light-first for the near-term production app.
- Use the screenshot folder and ZIP previews as taste references.
- Build consistent reusable primitives before polishing individual pages.
- Keep layouts dashboard-first and task-first.
- Make the product understandable for non-technical business owners.
- Preserve the multi-tenant SaaS architecture and the current build order.

Don't:

- Do not implement future modules just because a design reference shows them.
- Do not add WhatsApp, AI, Stripe, n8n, Vapi, Cal.com, catalog, orders, or automations unless that build step is explicitly started.
- Do not make the app look like a chatbot playground.
- Do not use decorative clutter, orbs, heavy gradients, or oversized marketing heroes in the dashboard.
- Do not let each page invent its own palette, radius, spacing, or button style.
- Do not imply medical, legal, or financial diagnosis/advice.
- Do not remove human fallback from the product story.
