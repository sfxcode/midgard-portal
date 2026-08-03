---
name: stack
description: Technology stack, library choices, and the reasoning behind them. Load when working with specific technologies or making decisions about libraries and tools.
triggers:
  - "library"
  - "package"
  - "dependency"
  - "which tool"
  - "technology"
edges:
  - target: context/decisions.md
    condition: when the reasoning behind a tech choice is needed
  - target: context/conventions.md
    condition: when understanding how to use a technology in this codebase
  - target: context/auth.md
    condition: when the technology in question is @sfxcode/nuxt-ui-mongocamp
  - target: context/architecture.md
    condition: when understanding how a library fits into the overall request flow
grounds_to: []
last_updated: 2026-08-03
---

# Stack

## Core Technologies
- **Nuxt 4.5** — app framework, `app/` source directory layout.
- **Vue 3.5** (`<script setup>` everywhere) — component layer.
- **TypeScript** (`vue-tsc` for typecheck, not raw `tsc`) — `pnpm typecheck` runs `nuxt typecheck`.
- **Nuxt UI v4** — component library (`UTable`, `UDashboardNavbar`, `USelectMenu`, `UEditor`, `FUDataEdit`, etc.).
- **UnoCSS** (not Tailwind) — brought in transitively by `@sfxcode/nuxt-ui-mongocamp` via `unocss-nuxt-ui`, which removes the Tailwind Vite plugin entirely.
- **Pinia + `@pinia/colada`** — data-fetching state layer; every domain entity has a `use*Store()`.
- **pnpm** — package manager (`pnpm-lock.yaml`).
- **Node 22** — CI matrix runs Node 22 on ubuntu-latest.

## Key Libraries
- **`@sfxcode/nuxt-ui-mongocamp`** (the user's own published package) — auth, session state, role-gating, and the admin Users/Roles UI. Not a direct MongoDB driver — a REST client to a separate MongoCamp server. See `context/auth.md`.
- **`@tanstack/table-core`** (via Nuxt UI's `UTable`) — all list tables. Custom filter functions live in `app/composables/useTableColumnHeader.ts`; never reach for TanStack's built-in `'arrIncludesSome'` filterFn on a scalar column (it assumes array-valued rows) — use [`multiSelectFilter()`](mex://function:36438aad1fcd886cdac7b41f2951f47b) instead.
- **`zod`** — schema validation backing every `*Schema()` composable (`useStammSchemas.ts`, `useWesenSchema.ts`, `useAbenteurerSchema.ts`, etc.) that drives `FUDataEdit` forms.
- **`@3d-dice/dice-box`** + **`@dice-roller/rpg-dice-roller`** — 3D dice physics and notation parsing for the `/secured` dice roller. Both are transpiled explicitly in `nuxt.config.ts`'s `build.transpile`.
- **`nuxt-pdfmake`** (wrapping `pdfmake`) — PDF export for Stamm lists; needs `pdfmake/build/pdfmake` and `pdfmake/build/vfs_fonts` in Vite's `optimizeDeps.include` or the build breaks.
- **`@nuxt/fonts`** — self-hosts Cinzel/Alegreya/Alegreya Sans; requires `global: true` per family entry or fonts silently fail to register (see `context/conventions.md`).
- **`@vueuse/core`** — general composable utilities used throughout.

## What We Deliberately Do NOT Use
- **No Tailwind** — removed entirely by the UnoCSS swap; any Tailwind-specific at-rule (`@theme`, `@layer`) in CSS will silently no-op.
- **No `@3d-dice/dice-ui`** — its `DisplayResults` widget had real bugs (wrong method name, wrong total for dropped/rerolled dice); replaced by the project's own `app/components/dice/DiceResultDisplay.vue`. The dependency is currently unused — a removal candidate if not picked up again.
- **No i18n library** — despite German domain terms throughout the UI, there is no `@nuxtjs/i18n` setup; don't introduce one without direction from the user.
- **No direct PrimeVue** in this app — `scratch/midgard-portal-nuxt/` is PrimeVue-based but is a reference-only sibling project, not a dependency of this app.
- **No test runner** — no Vitest/Jest/Playwright test suite is wired into this repo or its CI; don't assume one exists when asked to "run the tests."

## Version Constraints
`compatibilityDate: '2026-07-31'` is pinned in `nuxt.config.ts`. No other hard version pins beyond what's in `package.json`'s `^` ranges — Renovate is configured (per the README) to keep dependencies current.
