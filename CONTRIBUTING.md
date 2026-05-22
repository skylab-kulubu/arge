# Contributing Guide

Thank you for taking the time to contribute to SKY LAB Ar-Ge! This guide helps you get familiar with the codebase, understand the reasoning behind its architectural decisions, and submit your changes smoothly.

## Table of Contents

- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [How to Contribute](#how-to-contribute)
- [Commit Convention](#commit-convention)

---

## Project Structure

```text
arge/
├── public/
│   └── skylab.svg                # SKY LAB emblem (used in logo, hero, header, footer)
│
├── src/
│   ├── app/                      # Next.js App Router root
│   │   ├── layout.js             # Root layout — fonts, metadata, OG tags, viewport
│   │   ├── page.js               # Landing page — Hero + Teams + Onboarding + Footer
│   │   ├── globals.css           # Tailwind v4 tokens, custom CSS, animation keyframes
│   │   ├── robots.js             # Auto-generated robots.txt
│   │   ├── sitemap.js            # Auto-generated sitemap.xml
│   │   │
│   │   ├── components/           # Cross-page shared components
│   │   │   ├── Background.jsx    # bg-layers / iris / stars / grain layers
│   │   │   ├── Header.jsx        # Landing header with the "Stand View" CTA
│   │   │   ├── Footer.jsx        # Contact + quick links
│   │   │   ├── SkylabLogo.jsx    # Emblem drawn path-by-path via Framer Motion
│   │   │   └── landing/          # Landing-specific sections
│   │   │       ├── Hero.jsx
│   │   │       ├── Teams.jsx     # Scroll-pinned team showcase
│   │   │       ├── Onboarding.jsx
│   │   │       └── utils.jsx     # Spotlight, Magnetic, useReveal, ScrollContainerContext
│   │   │
│   │   └── stant/                # /stant route — kiosk mode
│   │       ├── page.jsx          # Ambience hook + responsive guard
│   │       └── components/
│   │           ├── Header.jsx
│   │           ├── Teams.jsx     # Keyboard + auto-loop team carousel manager
│   │           ├── TeamLogoTile.jsx
│   │           ├── Showcase.jsx  # Enter/exit transition wrapper
│   │           ├── ShowcaseBody.jsx
│   │           └── QRCode.jsx    # Client-side SVG QR via qrcode-generator
│   │
│   └── data/
│       └── teams/                # Single source of truth for all content
│           ├── index.js          # Barrel re-export
│           ├── teams.js          # TEAMS array (id, name, description, leads, stack, works, applyUrl)
│           └── visuals.js        # TONE color palette + STATUS pill dictionary
│
├── eslint.config.mjs             # ESLint 9 flat config (next/core-web-vitals)
├── jsconfig.json                 # @ alias → src
├── next.config.mjs               # Next.js config (currently minimal)
├── postcss.config.mjs            # Tailwind v4 postcss plugin
└── package.json
```

---

## Architecture

### Data Flow

```text
src/data/teams/teams.js          (static content source)
        │
        ▼
src/data/teams/index.js          (barrel: TEAMS, TONE, STATUS)
        │
        ▼
imported via the @/data/teams alias
        │
        ├──▶ src/app/page.js                  ──▶ Hero / Teams / Onboarding
        │                                              │
        │                                              ▼
        │                                     Framer Motion + scrollYProgress
        │                                     (sticky pin + active tab)
        │
        └──▶ src/app/stant/page.jsx           ──▶ Teams (keyboard + auto-loop)
                                                       │
                                                       ▼
                                              Showcase ──▶ ShowcaseBody ──▶ QRCode
```

Content flows in a single direction: `data/teams` is plain JavaScript data → components consume it. There is no backend, no API call, and no runtime fetch.

### Key Patterns

- **Server vs Client Components** - Every interactive component (`Hero`, `Teams`, `Onboarding`, everything under `stant/`) starts with the `"use client"` directive. `layout.js`, `page.js`, `robots.js`, and `sitemap.js` remain on the server.
- **Single Source of Truth** - Everything about teams lives in the `TEAMS` array inside `src/data/teams/teams.js`. Adding a new team is a single entry in that array — the UI adapts automatically.
- **Tonal Color System** - The `TONE` map in `visuals.js` exposes `ring / chip / icon / glow / soft` values per team identity. Always read colors through `TONE[team.tone]` rather than hard-coding them inside components.
- **Scroll-Pinned Sections** - `Teams.jsx` uses `useScroll` + `scrollYProgress` bound to the container's scroll to build a sticky frame per team. The trigger is propagated through `ScrollContainerContext`.
- **Custom Hooks** - Behavioural units like `useReveal`, `useShouldAnimate`, `useScrollContainer`, and `useAmbience` (stand) are collected in `landing/utils.jsx` and the pages that need them.
- **Reduced Motion &amp; Pointer Guards** - Pointer-reactive and parallax effects are gated by `matchMedia("(hover: hover) and (pointer: fine)")` and `prefers-reduced-motion` to preserve accessibility.

### Design System

- **Theme** - Dark with neon accents; the primary brand tone is `skylab` (`rgb(224,200,229)`).
- **Typography** - `Space Grotesk` (body / headings) + `JetBrains Mono` (labels, code, `font-mono` utility). Self-hosted via `next/font/google`.
- **Styling** - Tailwind CSS v4 (`@tailwindcss/postcss`). Global tokens, `selection:`, scrollbar variants, and layered effects live in `src/app/globals.css`.
- **Iconography** - `lucide-react`. When adding icons, keep `strokeWidth` and sizes consistent with their neighbours.
- **Animation** - Framer Motion 12; variants (`container`, `item`, `stepItem`) are declared at the top of each component. Preferred easing is `[0.16, 1, 0.3, 1]` and transitions sit in the 0.4–0.8s range.

---

## How to Contribute

1. **Fork** the repository: <https://github.com/fatiihnaz/arge>
2. Create a new **branch**:
   ```bash
   git checkout -b feat/new-team-card
   ```
3. Make your changes and verify them locally:
   ```bash
   npm run lint
   npm run dev
   ```
4. **Commit** with consistent messages (see the convention below):
   ```bash
   git commit -m "feat: add chainlab works list"
   ```
5. **Push** the branch to your fork:
   ```bash
   git push origin feat/new-team-card
   ```
6. Open a **Pull Request** against `fatiihnaz/arge`; in the description, explain the intent of the change, attach screenshots if relevant, and list manual test steps.

> Content updates (team description, leads, apply URL) only require edits to `src/data/teams/teams.js`.

---

## Commit Convention

This project uses a variant of [Conventional Commits](https://www.conventionalcommits.org/). The message format is:

```text
<type>: <short description>
```

| Prefix | Usage |
| --- | --- |
| `feat` | A new feature, page, or component is added. |
| `fix` | A bug or regression is resolved. |
| `refactor` | Code reorganisation with no behavioural change (renames, file splits, hook extraction). |
| `restyle` | Visual or style changes only (color, spacing, animation tweaks). |
| `docs` | Updates to README, CONTRIBUTING, or inline documentation. |
| `chore` | Tooling work — dependencies, lint config, build scripts. |

**Examples**

```text
feat: add QR fallback for stand view
fix: prevent hash navigation on missing team id
refactor: extract useAmbience into shared hook
restyle: tighten team tab spacing on short screens
docs: document NEXT_PUBLIC_SITE_URL usage
```

---

For questions or suggestions: **info@yildizskylab.com**.
