# JapaLearn AI — Colour Rules

## Brand Colours

| Use | Colour | Hex |
|-----|--------|-----|
| Primary (buttons, links, accents, dashboard) | JapaLearn Blue | `#3b75ff` |
| Landing page CTA section background | Original Purple | `#702DFF` |
| CTA button text on purple background | Original Purple | `#702DFF` |

## Rules

### Dashboard, Quiz, Report, Login, Signup pages
- Use `#3b75ff` (JapaLearn Blue) for ALL primary colours
- `--primary` CSS variable = `#3b75ff`
- Do NOT use `#702DFF` anywhere in these pages

### Landing page (index.js + components/layout/)
- The **CTA section** (Footer.jsx `.cta-grid`) background stays `#702DFF` (original purple)
- The "Take The Free AI Quiz" button on the CTA section has `style={{ color: '#702DFF' }}` hardcoded — do NOT change it to `text-primary`
- All other elements on the landing page (Hero, Roadmap, Stats, Testimonials) that use `text-primary` or `bg-primary` will reflect `#3b75ff` — this is intentional and correct
- Do NOT change `.cta-grid` in globals.css — it must stay `#702DFF`

## globals.css
- `--primary: #3b75ff` (dashboard blue)
- `.cta-grid { background-color: #702DFF; }` — hardcoded, never change this

## Summary
The landing page CTA block is the ONLY place that uses purple `#702DFF`.
Everything else in the app uses blue `#3b75ff`.
