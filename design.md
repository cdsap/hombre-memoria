# Design — Hombre Memoria

A locked design system for this archive. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
editorial

## Macrostructure family
- Marketing / home (`index.html`): Quote-Led — oral archive leads with a real voice
- Content pages (`informacion.html`, legal): Long Document
- Index pages (`articulos.html`): Index-First

## Theme
Newsprint (catalog voice) — cool archival paper, roman serif, ink-blue accent.

- `--color-paper`   oklch(97.2% 0.006 250)
- `--color-paper-2` oklch(94.5% 0.008 250)
- `--color-ink`     oklch(22% 0.022 255)
- `--color-ink-2`   oklch(46% 0.016 255)
- `--color-rule`    oklch(86% 0.010 250)
- `--color-accent`  oklch(42% 0.12 255)
- `--color-focus`   oklch(48% 0.14 255)

Axes: paper-band light · display-style roman-serif · accent-hue cool

## Typography
- Display: Newsreader, weight 600, style normal
- Body: Newsreader, weight 400 (same family; optical reading)
- Meta / outlier: IBM Plex Sans, weight 500 — buttons, labels, nav meta only
- Display tracking: -0.015em
- Type scale anchor: `--text-display` = clamp(2.25rem, 5.5vw, 3.75rem)

## Spacing
4-point named scale. Values live in `styles.css` `:root`. Pages must use named
tokens (`var(--space-md)`), never raw improvisation for major rhythm.

## Motion
- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`
- Reveal pattern: none (motion-cut archive)
- Reduced-motion fallback: opacity-only, ≤ 150 ms (already none by default)

## Microinteractions stance
- silent success / celebratory toasts: never
- hover delay ~0 · focus delay 0 ms
- buttons: colour + underline shift only; no bounce, no scale

## CTA voice
- Primary CTA: filled ink rectangle, 0 radius, IBM Plex Sans uppercase tracked
- Secondary CTA: typographic link (underline) or outlined ink chip, 0 radius

## Nav / Footer
- Nav: N9 Edge-aligned minimal — wordmark left, single destination right
- Footer: Ft6 Letter close — signoff + muted P.S. with legal / contact links

## Per-page allowances
- Home MAY surface one documentary photograph beside the article (existing assets)
- Content pages: typography + one portrait (`carlos.jpg`) inline to measure
- Index pages: typography only — no hero image
- No invented stock photos, no fleurons, no cream/terracotta palette

## What pages MUST share
- The wordmark “Hombre Memoria”
- The accent colour and its placement (≤ 5 % per viewport)
- Newsreader + IBM Plex Sans pairing
- The CTA voice (shape, radius 0, padding rhythm)
- N9 nav + Ft6 footer chrome

## What pages MAY differ on
- Macrostructure within the page-type family
- Hero archetype (Quote-Led on home only)
- Density of the article index rows

## Exports

### tokens.css
```css
:root {
  --color-paper:      oklch(97.2% 0.006 250);
  --color-paper-2:    oklch(94.5% 0.008 250);
  --color-ink:        oklch(22% 0.022 255);
  --color-ink-2:      oklch(46% 0.016 255);
  --color-rule:       oklch(86% 0.010 250);
  --color-accent:     oklch(42% 0.12 255);
  --color-accent-ink: oklch(97% 0.006 250);
  --color-focus:      oklch(48% 0.14 255);

  --font-display: "Newsreader", "Iowan Old Style", Georgia, serif;
  --font-body:    "Newsreader", "Iowan Old Style", Georgia, serif;
  --font-meta:    "IBM Plex Sans", "Helvetica Neue", sans-serif;

  --space-3xs: 0.25rem;  --space-2xs: 0.5rem;  --space-xs: 0.75rem;
  --space-sm:  1rem;     --space-md:  1.5rem;  --space-lg: 2rem;
  --space-xl:  3rem;     --space-2xl: 4.5rem;  --space-3xl: 7rem;

  --text-xs: 0.75rem;  --text-sm: 0.875rem; --text-md: 1.125rem;
  --text-lg: 1.375rem; --text-xl: 1.75rem;  --text-2xl: 2.25rem;
  --text-display: clamp(2.25rem, 5.5vw, 3.75rem);

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-short: 220ms;
  --radius-card: 0; --radius-pill: 0; --radius-input: 0;
}
```
