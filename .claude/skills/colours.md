# JapaLearn AI — Colour & Design Principles

## Brand Palette

| Colour | Hex | Usage |
|--------|-----|-------|
| JapaLearn Blue | `#3b75ff` | Primary — ALL buttons, links, accents, everywhere |
| White | `#ffffff` | Backgrounds, cards, text on blue sections |
| Light Blue Tint | `#EEF4FF` / `#F0F4FF` | Subtle icon backgrounds, input fields |
| Blue Gradient | `#c8d9ff → #eef4ff` | Hero glow, profile banner |
| Dark Text | `#202020` | Headings and body text |
| Muted Text | `#9E9E9E` / `#5F5F5F` | Secondary / supporting text |
| Slate BG | `#f6f9ff` / `#f1f5fb` | Page / section backgrounds |

## IMPORTANT: No Purple Anywhere
- `#702DFF` is fully removed from the app — do NOT use it anywhere, ever.

---

## Logo Rules

### Logo component: `lib/Logo.js`
- File: `/images/jp-logo.png` (blue hexagon sparkle icon)
- Used via `<Logo size={32} />` — import as `import Logo from '../lib/Logo'`
- `size` prop controls both width and height in px

### Where the logo appears
| Page | Logo Usage |
|------|-----------|
| Landing page (`Navbar`) | Logo icon + "JapaLearn **AI**" wordmark |
| Dashboard sidebar | `<Logo size={32} />` + "JapaLearn **AI**" wordmark (AI in `#3b75ff`) |
| All other pages (login, signup, quiz, report) | Navbar component handles it |

### Logo + wordmark pattern (used in Navbar and Sidebar)
```jsx
<Logo size={32} />
<span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>
  JapaLearn <span style={{ color: '#3b75ff' }}>AI</span>
</span>
```
- "JapaLearn" is dark (`#202020`)
- "AI" is blue (`#3b75ff`)

---

## Landing Page CTA Section (Footer.jsx)

This is the section: "Ready To Start Your Journey the Right Way?"

### Rules (from Figma):
- **Background**: `#3b75ff` blue with white grid lines — class `.cta-grid`
- **Heading**: fully white (`text-white`)
- **Subtext**: fully white (`text-white`) — NOT white/70
- **Button**: white background (`bg-white`), blue text (`color: #3b75ff`)
- **Tick icons + item text**: fully white (`text-white`) — NOT white/70 or white/80

### `.cta-grid` in `globals.css`:
```css
.cta-grid {
  background-color: #3b75ff;
  background-image: linear-gradient(#ffffff22 1px, transparent 1px),
    linear-gradient(to right, #ffffff22 1px, transparent 1px);
  background-size: 28px 28px;
}
```

---

## Landing Page — General

All sections (Hero, Stats, ProblemSection, Roadmap, Testimonials) use:
- Blue (`#3b75ff` via `text-primary` / `bg-primary`) for accents, buttons, highlights
- White backgrounds or very light blue tints
- Hero glow: `radial-gradient(circle, rgba(59,117,255,0.15) ...)`

---

## Dashboard Pages

All dashboard UI uses `#3b75ff`:
- Sidebar active items, hero banner, buttons, progress bars, score indicators
- Cards: white background with `shadow-[0px_14px_42px_rgba(8,15,52,0.06)]`
- Profile page banner: `linear-gradient(120deg, #3b75ff 0%, #93bbff 50%, #ffe4b5 100%)`
- Sidebar logo: `<Logo size={32} />` component
