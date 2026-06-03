# Viva Head

`Viva Head` is a bespoke rounded monoline display font generated from the supplied Viva alphabet sheet.

## Files

- `VivaHead-Regular.woff2` - preferred web font.
- `VivaHead-Regular.ttf` - desktop/installable fallback.
- `viva-head.css` - drop-in `@font-face` and `.viva-heading` helper.
- `specimen.html` - local visual proof sheet.

## Next.js usage

Copy the font files into `public/fonts/viva/`, then import or paste the `@font-face` block from `viva-head.css`.

```css
@font-face {
  font-family: "Viva Head";
  src: url("/fonts/viva/VivaHead-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

.viva-heading {
  font-family: "Viva Head", system-ui, sans-serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

This version covers uppercase, lowercase, numerals, and common ASCII punctuation. It is tuned as a display/heading face rather than a paragraph font.
