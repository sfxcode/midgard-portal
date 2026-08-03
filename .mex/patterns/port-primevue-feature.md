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

As of this app's current state, already ported: Stamm reference browsing/editing (`secured/manager/stamm/**`), DM Bestiarium, the 3D dice roller (net-new, not in scratch originally), player Abenteurer/Kampagnen pages (`secured/spieler/**`), and admin (via `@sfxcode/nuxt-ui-mongocamp`'s own components rather than scratch's hand-rolled admin — arguably already superseded, not a gap). Not yet ported: `secured/tools/**` (a calculator page) and the print/PDF-oriented templates (`templates/blueprint.vue`, `templates/print.vue`, `templates/calculator.vue`).

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
