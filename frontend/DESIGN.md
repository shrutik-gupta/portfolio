# Design notes

How the portfolio is put together visually, and where to change things.

## The idea

**A maquette on a print table.** The site reads as printed matter laid out on a
desk: prints taped down, a postcard, a ticket, rubber-stamp buttons, notes in
the margin. The 3D is a small set of matte building blocks. They stand on the
cover as a model you can poke, and come back in Skills as a literal stack.

The round light from the portrait is the recurring mark: the **disc**. It is the
sun or moon on the cover (tap it to change theme), the theme switch in the
navigation, and the thing that rises while the page loads.

## Type

| Role | Font | Class |
| --- | --- | --- |
| Headlines | Fraunces (soft, wonky) | `h1`–`h4`, `.display` |
| Emphasis inside a headline | Fraunces italic, lighter | `.display-i` |
| Reading text and labels | Bricolage Grotesque | default, `.label` |
| Margin notes | Caveat | `.hand` |

Fonts are self-hosted through `@fontsource-variable/*` (imported in
`src/main.jsx`), so nothing depends on a font CDN.

## Colour

All colours are tokens in `src/index.css`, exposed to Tailwind in
`tailwind.config.js`. Two themes, designed separately:

- **After dark** (`.dark`): wine-black desk, cream ink, coral, powder blue, butter.
- **Daylight** (`.light`): warm paper, black ink, vermilion, cobalt, butter.

Anything with the `.paper` class is a physical sheet. It stays cream in both
themes and re-declares the ink tokens locally, so text utilities inside it
always resolve to ink-on-paper.

`--scene-*` tokens colour the 3D blocks; `src/three/useThemeColors.js` reads
them and repaints the scenes when the theme changes.

## Building blocks (CSS)

`.paper` `.tape` `.stamp` / `.stamp--solid` `.marker` `.link-ink` `.field` /
`.field--ruled` `.ticket` `.perforation` `.postage` `.crop` `.label` `.hand`

Hand-drawn marks (arrows, squiggle, spark) live in `src/components/Doodles.jsx`.

## Motion

- One entrance: add `data-reveal` (`up`, `drop`, `left`, `right`, `fade`) and
  call `useReveal(ref)` in the section. See `src/lib/reveal.js`.
- Scroll-linked motion is limited to: the hero blocks drifting apart, prints
  turning slightly, the skills stack building, the path line drawing, and the
  footer name rising. Nothing is pinned.
- Everything checks `prefers-reduced-motion`. With it on there is no smooth
  scroll, no WebGL (flat fallbacks are shown) and no scroll animation.

## 3D

- `src/three/Stage.jsx` — the one place canvases are mounted. Caps resolution,
  pauses off-screen and in background tabs.
- `src/three/Maquette.jsx` — the cover model. `fallen` lays it on its side (404).
- `src/three/StackTower.jsx` — the skills stack, driven by a ref the Skills
  section writes on scroll.
- `src/three/rig.jsx` — shared camera, lights and easing.

Scenes sit beside content, never behind it.

## Three kinds of visitor

`src/lib/audience.jsx` defines three routes: hiring, project, wandering. Picking
one (cover doors, or the slip in the top-right corner) does not hide anything.
It only adds:

- a "next stop" button in the route slip,
- a few handwritten notes (`<LensNote show="hire">…</LensNote>`),
- a contact form that opens with the right question.

The choice is kept for the browser session.

## Navigation

- Desktop: the spine on the left edge (`src/components/Navbar.jsx`).
- Mobile: the dock along the bottom, with an Index page.
- Routes are unchanged: `/`, `/about`, `/projects`, `/experience`, `/contact`,
  `/preferences`, `/parallel`.

## Content

- Projects: `src/helper/ProjectHelper.jsx`
- Experience: `src/helper/ExperienceHeper.jsx`
- Facts, awards, courses, services, skills: `src/helper/ProfileHelper.jsx`

Education, awards, courses and services mirror the Saarthi knowledge base in
`backend/controller/chatController.js`. If one changes, change the other.
