# Design Reference

## Status

This file records the approved visual references for future Viva styling work. The root `DESIGN.md` is now the primary design source of truth. Do not apply these visuals to the production app until the user explicitly asks for a design/styling pass.

## Primary References

- Project design source of truth: `C:\Users\Rich\Documents\New project 5\DESIGN.md`
- Screenshot reference folder: `C:\Users\Rich\Desktop\VivaAppStyling`
- Design system archive: `C:\Users\Rich\Downloads\Viva Design System.zip`
- Key design-system files inside the archive:
  - `README.md`
  - `SKILL.md`
  - `colors_and_type.css`
  - `ui_kits/viva-app/README.md`

## Screenshot Coverage

The screenshot folder includes preferred GPT image mockups for:

- Dashboard layouts in light and dark modes
- Sidebar and navigation treatments
- Buttons, badges, inputs, typography, icon system, and color schemes
- Onboarding, configuration dashboard, channels, offerings, operations inbox, chat preview, order requests, payment settings, team/staff roles
- Empty states, error states, notification alerts, and future module surfaces
- Viva logo and favicon variants

## Direction

- Use these screenshots as the visual taste reference for Viva App styling.
- Use the design-system markdown/CSS files as the source of brand tokens, typography, colors, spacing, and component behavior.
- Preserve the product architecture: one multi-tenant SaaS app with one dashboard and tenant-scoped data.
- Do not build future modules during a styling pass unless separately requested.
- Treat light mode as the near-term production default unless the user explicitly asks for dark mode.
- Dark mode references are useful for future premium polish, but should not force a full dark-mode implementation yet.

## Visual Principles To Carry Forward

- Premium SaaS dashboard, not a marketing landing page.
- Clean spacing, strong hierarchy, clear empty states, and minimal decorative clutter.
- Business-owner language: direct, confident, operational.
- Consistent reusable primitives for buttons, inputs, cards, badges, sidebars, and module cards.
- Use real Viva/TFS logo assets from the design system when implementing brand polish.
