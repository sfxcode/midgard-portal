---
name: architecture
description: How the major pieces of this project connect and flow. Load when working on system design, integrations, or understanding how components interact.
triggers:
  - "architecture"
  - "system design"
  - "how does X connect to Y"
  - "integration"
  - "flow"
edges:
  - target: context/stack.md
    condition: when specific technology details are needed
  - target: context/decisions.md
    condition: when understanding why the architecture is structured this way
  - target: context/auth.md
    condition: when the task touches login, session state, or role-gated routes
  - target: context/conventions.md
    condition: when implementing against a component described here
  - target: patterns/add-list-page.md
    condition: when adding a new list/table page under any of the route groups below
  - target: patterns/port-primevue-feature.md
    condition: when a requested feature might already exist in scratch/midgard-portal-nuxt
grounds_to: []
last_updated: 2026-08-03
---

# Architecture

## System Overview
A request for any `/secured/**` page first passes through `@sfxcode/nuxt-ui-mongocamp`'s global `global-auth` middleware, which checks `useMongocampStorage()` (a persisted cookie, not sessionStorage — see `context/auth.md`) and bounces to `/login` if absent. `/secured/**` routes are rendered client-only (`routeRules` in `nuxt.config.ts`) so this check doesn't race SSR. Once past auth, `app/layouts/default.vue` renders the sidebar (built from Pinia-Colada stores — `useZauberStore`, `useBestiariumStore`, `useAbenteurerStore`, etc. — each independently fetching its own collection) plus every page's own content via `AppPageHeader` for chrome. List pages fetch their collection through a domain composable (e.g. `useZauber()`, `useWesen()`), render a `UTable` with columns from `withResponsiveBreakpoints()`/`useResponsiveColumnVisibility()`, and hand off count/pagination/reset to `TableFooter`. Detail/edit pages call the matching `*Schema()` composable (Zod-backed, from `useStammSchemas.ts` etc.) to drive a `FUDataEdit` form, then persist through a composable like `useStammEdit().saveStammDocument()`.

## Key Components
- **`@sfxcode/nuxt-ui-mongocamp`** — the auth + admin-UI module. Supplies `useMongocampStorage()`/`useMongocampRoles()`/`useMongocampAuth()` (all globally auto-imported, no local plugin needed), the `global-auth` middleware, and the `MongocampUsers`/`MongocampRoles` components used wholesale at `/secured/admin/**`. See `context/auth.md`.
- **Pinia + `@pinia/colada`** — every domain entity (Zauber, Fertigkeiten, Typen, Wesen, Abenteurer, Spieler, Spielergruppen, Kampagnen) has a `use*Store()` in `app/stores/` that wraps a `@pinia/colada` query; the sidebar and every list page read from these stores rather than fetching directly.
- **`app/composables/`** — domain logic layered under the stores: nested per-domain folders (`stamm/`, `dm/`, `spieler/`, `tools/`) hold data-shaping, schema, and export composables. Nested-folder composables are NOT auto-imported — see [[context/conventions.md]].
- **Shared page chrome (`AppPageHeader.vue`, `TableFooter.vue`, `useResponsiveColumns.ts`)** — every secured page and `UTable` goes through these instead of hand-rolled navbar/pagination/column-visibility code. See `patterns/add-list-page.md`.
- **`scratch/midgard-portal-nuxt/`** (gitignored) — a mature PrimeVue implementation of the same product; the source of truth for feature shape when building anything that might already exist there. Never copied as-is. See `patterns/port-primevue-feature.md`.

## External Dependencies
- **MongoCamp server** (separate service, not in this repo) — reached via `@sfxcode/nuxt-ui-mongocamp`'s REST client, configured with `MONGOCAMP_URL`/`MONGOCAMP_API_KEY` env vars in `nuxt.config.ts`'s `mongocamp` block.
- **`@3d-dice/dice-box`** — client-side 3D dice physics on `/secured`, driven by [`useDiceBox()`](mex://function:bedc5e2ad7f5c943a28729c754ebeb1c). Rendering is via the `onRollComplete` callback + `getRollResults()`, not the `roll()` promise return value — see `patterns/` (dice gotchas documented in the composable's own comments).
- **Google Fonts (Cinzel, Alegreya, Alegreya Sans)** — self-hosted at build time via `@nuxt/fonts` with `global: true` on each family entry.
- **`nuxt-pdfmake`** — PDF export for Stamm lists (Zauber/Fertigkeiten/Typen), via `app/composables/usePdf.ts`.

## What Does NOT Exist Here
- No i18n — German domain terms (Zauber, Fertigkeiten, Spieler, Kampagnen, Bestiarium) sit untranslated alongside English system chrome (Users, Roles, Administration) by design; this is not an inconsistency to fix.
- No test runner — verification is `pnpm lint` + `pnpm typecheck` (both required by CI) plus manual/Playwright verification for behavior; there is no unit/e2e test suite in this repo.
- No deployment configured — no Vercel/Netlify config, no deploy step in CI, no known live URL. Ask the user rather than guessing one.
- No direct MongoDB access — all data access goes through the MongoCamp server's REST API via the module, never a driver.
