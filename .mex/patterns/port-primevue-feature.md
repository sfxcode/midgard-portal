---
name: port-primevue-feature
description: When a requested feature might already exist in the scratch/midgard-portal-nuxt PrimeVue reference app — check there first, then rebuild in Nuxt UI, never copy PrimeVue code as-is.
triggers:
  - "port"
  - "scratch"
  - "primevue"
  - "already exists"
  - "character sheet"
  - "calculator"
  - "print template"
edges:
  - target: context/decisions.md
    condition: for the full reasoning behind the PrimeVue-to-Nuxt-UI rewrite decision
  - target: context/architecture.md
    condition: for how ported features fit into this app's store/composable/page layering
grounds_to: []
last_updated: 2026-08-03
---

# Port a Feature from the PrimeVue Reference App

## Context
`scratch/midgard-portal-nuxt/` (gitignored, local-only) is a mature, full-featured PrimeVue implementation (v0.8.1) of this same "Lost Kingdom" campaign-manager idea. It is the **source of truth for product features and data shapes** that this app (the Nuxt UI rewrite) progressively replaces — but its PrimeVue UI code is never copied as-is.

Data-layer code (Pinia stores, models) is largely UI-framework-agnostic and has mostly already been carried over near-verbatim where it was ported. Every `.vue` component, by contrast, gets rebuilt from scratch using Nuxt UI + UnoCSS.

As of this app's current state (verified 2026-08-03 by diffing `scratch/midgard-portal-nuxt/app/pages` and `/components` directly against this app's, not by trusting older notes), already ported or superseded:
- Stamm reference browsing/editing (`secured/manager/stamm/**`), including the learning-cost tables — scratch's separate `secured/stamm/lernen/zauber.vue` route is dead PrimeVue placeholder content (unrelated "Products"/"Rollen" demo data), not real functionality to port; the real Lerneinheiten data is already integrated into this app's Zauber/Fertigkeiten/Typen pages via `app/models/lernen.ts`.
- DM Bestiarium, player Abenteurer/Kampagnen pages (`secured/spieler/**`), Spielergruppen (net-new here, no scratch equivalent).
- The 3D dice roller on `/secured` — this also covers scratch's `secured/tools/index.vue` ("Würfelgenerator"), which is just a plain dice-roller page, not a calculator despite the route name suggesting otherwise.
- PDF export for Zauber/Fertigkeiten/Typen (`useZauberExport.ts`/`useFertigkeitenExport.ts`/`useTypenExport.ts`) — already exceeds scratch's `templates/print.vue`, which is a minimal one-spell demo, not a real feature.
- Admin (via `@sfxcode/nuxt-ui-mongocamp`'s own components) — scratch's own `secured/admin/index.vue` is an empty stub, not a real dashboard to port.
- `templates/blueprint.vue` is also an empty stub — nothing to port.

**Not yet ported — the one real gap:** the **Basis-Eigenschaften calculator** (`templates/calculator.vue` + `components/calculator/BasisEigenschaft.vue`). A Midgard-specific point-buy character-attribute tool: six base stats (ST/GS/GW/KO/IN/ZT) against a 420-point budget, plus derived combat bonuses (SchB/AnB/AbB/AusB) via game-specific formulas (see the component/page source in scratch for the exact math — it's small but encodes real game rules, so preserve the formulas exactly rather than approximating). Confirmed absent here via `grep -ri eigenschaft app/` (only unrelated character-sheet model fields turn up).

## Steps
1. Before designing a requested feature from scratch, check `scratch/midgard-portal-nuxt/app/` for an existing PrimeVue implementation of the same feature — character sheets, bestiary, spell/skill/type browsing, dice rolling, PDF export, and admin are all precedented there.
2. If found, treat it as the spec for data shape and behavior, not as source to copy. Identify the equivalent Pinia store/model (if one already exists in this app's `app/stores/`/`app/models/`, it was likely already ported near-verbatim — check there first rather than re-deriving from scratch's version).
3. Rebuild the UI layer using this app's own conventions: `AppPageHeader`/`TableFooter` for chrome (see `patterns/add-list-page.md`), Nuxt UI's `UEditor` in place of scratch's `@tiptap/*` rich text, this app's own theme tokens (never scratch's PrimeVue theme).
4. Check `scratch`'s `nuxt.config.ts`/`formkit.config.ts` only for feature-parity questions (e.g. what a form schema should validate) — its module wiring (PrimeVue-specific FormKit inputs, `vue-sidebar-menu`, i18n) does not apply here.

## Gotchas
- Don't assume a feature is net-new just because it's not mentioned by the user — if it sounds like campaign-manager functionality (character sheets, bestiary, spell/skill browsing, dice, PDF export, admin), it's very likely already speced out in `scratch/` even if the request doesn't say so explicitly.
- Data-layer parity is not UI parity — a store/model existing in this app doesn't mean the page/component consuming it has been built yet.
- `scratch/` is gitignored — don't expect `git log`/`git blame` to tell you anything about it; read the files directly.

## Verify
- [ ] Checked `scratch/midgard-portal-nuxt/app/` for an existing implementation before designing from scratch
- [ ] No PrimeVue component, prop shape, or class name copied directly into this app
- [ ] New UI goes through this app's shared chrome (`AppPageHeader`, `TableFooter`) rather than reinventing scratch's `vue-sidebar-menu`-based layout
- [ ] `pnpm lint` and `pnpm typecheck` pass

## Update Scaffold
- [ ] After porting a feature, update this file's "already ported" / "not yet ported" lists and `.mex/ROUTER.md`'s Current Project State
