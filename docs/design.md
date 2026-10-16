# Design

The client gallery follows the visual language of the existing portfolio
(`photographer_portfolio/portfolio`), so the client feels they are on the
photographer's own site. The same tokens and base styles are shared by the
gallery, the portfolio and (partly) the admin.

## Visual language of the portfolio

Extracted from `photographer_portfolio/portfolio/src` (`styles/global.css`,
`components/*`, `pages/index.astro`).

- **Editorial minimalism.** White background, black text, photos do the
  talking. No shadows, no cards with borders, almost no rounding (2px).
- **One accent.** Burnt orange `#c43e13` for hover, active links, selection,
  scrollbar and primary buttons. Light grey `#e0e0e0` as the neutral
  (placeholders, separators, empty states).
- **Monospace typography.** `JetBrains Mono` for everything, base 14px.
  Navigation, labels and captions are UPPERCASE with 1px letter spacing.
  Large display title (70px desktop / 32px mobile) for the hero, the brand
  name in italic.
- **Text links instead of buttons** where possible: `inst →`,
  `view examples →`, `← prev` / `next →`. Hover changes the color to the
  accent.
- **Hero.** Full-viewport cover photo, dark overlay `#0f0b0a66`, centered title
  with an uppercase subtitle. Transparent blurred header on top that switches
  from light to dark text once the hero is scrolled past.
- **Photo grids.** `auto-fit` grid of portrait (3:4) cards with 20px gap;
  collection pages use a 2-column grid where horizontal photos span both
  columns (1 column on mobile). Hover: the photo slowly zooms (`scale(1.1)`,
  0.4s) inside its frame. **Not used in kadr:** no hover scaling anywhere.
- **Layout.** Content max width 1320px, page padding 45px (20px on mobile),
  header height 120px (80px on mobile), breakpoint ~800px.
- **Footer.** Black block with white uppercase links.

## Client gallery

### Screens

1. **Cover (hero)** — the gallery's cover photo (`is_cover`, otherwise the first
   photo) full-screen with the dark overlay; gallery title as the display
   title; uppercase subtitle (photographer brand / date); `view photos ↓` text
   link that scrolls to the grid.
2. **Top bar** — appears over the hero like the portfolio header, becomes
   solid (blurred white) after the hero. Left: brand. Right, uppercase mono:
   - selection counter `selected 34 / 30`;
   - when above the package: `+4 × 150 ₴ = 600 ₴` in the accent color;
   - filter text links `all` / `selected ♥`;
   - `download all →`.
3. **Grid** — justified rows (like Google Photos): every photo keeps its
   aspect ratio, rows have equal height (`--photo-row-height`, 360px desktop /
   240px mobile, so two portrait frames share a row on a phone) and fill the full width, order stays left-to-right. Pure CSS:
   each item grows proportionally to its ratio. No captions in the grid (file
   names only in the viewer). The gallery uses the wide page container
   (`.page--wide`, up to 1920px) instead of the portfolio's 1320px. On phones
   the feed is almost edge to edge: 6px side padding and 6px gaps. Top-right heart and comment count: on mouse
   devices they appear only on hover together with a soft top-down gradient
   (liked photos too). On touch devices the grid shows no icons at all —
   liking and commenting happen in the viewer.
4. **Viewer** — light (white background, like the site), PhotoSwipe 5 themed
   with our tokens: opens by zooming from the thumbnail, swipe with physics,
   pinch/double-tap zoom, keyboard arrows, neighbour preloading. Top bar:
   close on the left; comments (with count) and heart on the right. Bottom:
   the position `3 / 18` in muted mono (no file name). Chevron arrows on mouse devices only.
   Browser "back" does not close it yet (PhotoSwipe 5 has no history module).
5. **Comments** — per photo, several per photo, no author. Opened from the
   viewer: a side panel on desktop (photo shifts left), a bottom sheet on
   mobile. List of light-grey cards with text and date (`16 жовтня о 21:20`),
   input with a send icon pinned at the bottom, Enter sends. Photos with
   comments show a comment icon with the count in the grid.
6. **Expired / not found** — neutral grey full-height block with a short
   uppercase message, like the portfolio's empty state.

### Principles

- Photos first: UI is thin text, never covers more of a photo than needed.
- Every action is a text link or an icon; only the main CTA is a filled
  accent button.
- Same tokens as the portfolio, so a future portfolio redesign changes both.

## Implementation

### Tokens and base styles — `@kadr/ui/styles.css`

All values are CSS custom properties; components never hardcode colors, fonts
or spacing.

| File                               | Contents                                                      |
| ---------------------------------- | ------------------------------------------------------------- |
| `styles/tokens.css`                | colors, fonts, font sizes, spacing, layout, radius, motion, z |
| `styles/base.css`                  | reset, body, links, images, selection, scrollbar, form fields |
| `styles/typography.css`            | text utility classes (`.text-upper`, `.text-hover`, ...)      |
| `styles/layout.css`                | `.page` container                                             |
| `styles/components/button.css`     | `.btn`, `.btn--primary`                                       |
| `styles/components/photo-card.css` | `.photo-card` (frame + overlay + caption)                     |

Colors are semantic (`--color-bg`, `--color-text`, `--color-accent`,
`--color-muted`, `--color-overlay`, `--color-inverse-*`), not raw palette
names, so the inverted viewer just swaps tokens.

### Components

- **CSS first.** Visual components are CSS classes in `@kadr/ui`, so the
  portfolio (Astro) and the Vue apps share exactly the same styles: Astro
  writes the markup with the class, Vue uses a thin component.
- **Vue components only where they remove duplicated markup or add
  behaviour** (`PhotoCard`, later `Lightbox`, `HeartToggle`). They contain no
  styles of their own beyond the shared classes.
- Icons are one set of thin line SVGs (24px, 1.5px stroke) in
  `packages/ui/src/icons/`, drawn by us. They are painted through CSS
  `mask-image` (`.icon .icon--heart`), so they take `currentColor`. On photos
  they sit on a soft top-down dark gradient (`--color-scrim`) so they stay
  readable on light frames.
- References for patterns: Pixieset / Pic-Time / Lightroom shared albums
  (heart for selection, comments inside the viewer).

### Fonts

`JetBrains Mono` (text) and `Inter` (display title) from Google Fonts, linked
in each app's HTML. The old portfolio used `Inter` for the title without
loading it, so it rendered in the system sans-serif; here it is loaded
explicitly.

### Admin

The admin keeps PrimeVue (Aura) for tables and forms. Later the Aura preset can
be mapped to the same tokens (accent, font) so the admin matches the brand.

### Motion

Follows `emil-design-eng`: motion only where it gives feedback or prevents a
jarring change, never on hover scaling or keyboard navigation.

- Tokens: `--ease-out` `cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out`,
  `--duration-press` 160ms, `--duration-base` 200ms, `--duration-slow` 300ms.
- Press feedback: buttons `scale(0.97)`, heart `scale(0.9)` on `:active`.
- Like: short heart "pop" (`0.85 → 1.12 → 1`).
- Photos fade in when loaded; the grid reserves space via `aspect-ratio`, so
  nothing jumps.
- Hover effects only under `(hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion`: no movement, only opacity/color transitions;
  the viewer opens without the zoom animation.
