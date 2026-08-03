---
name: decisions
description: Key architectural and technical decisions with reasoning. Load when making design choices or understanding why something is built a certain way.
triggers:
  - "why do we"
  - "why is it"
  - "decision"
  - "alternative"
  - "we chose"
edges:
  - target: context/architecture.md
    condition: when a decision relates to system structure
  - target: context/stack.md
    condition: when a decision relates to technology choice
  - target: patterns/port-primevue-feature.md
    condition: when the PrimeVue-to-Nuxt-UI rewrite decision affects a new feature
grounds_to:
  - node: "function:54b86f5d03fc7d414f96708c8c778140"
    fingerprint: "mh:64:7b226d696e68617368223a5b33333830393232392c313037323836332c34373037303039302c383638393230362c34373830363431312c34383038393434382c32313833393931392c33333237303937352c36303232333137322c32373536353437312c393039393633342c31353638333739362c36323630333730392c33343438313634322c31333137393237352c33343534313332322c34323138313935332c31303836333439392c35363635323237362c31373936343939352c34363936393430372c3237383732323730322c34353831393735362c333130313835352c33353934353230322c36353536363832362c31323438323130372c32333239363630332c39333039313239342c333038333636392c3334303730302c31333237353231322c32373733383333372c34303134313533302c31343237343234332c313934333631382c32333831333630342c37323731343436362c32343839343034332c3134343833343039302c343031343031302c34383535313237302c34383637353032322c32303939363230302c32333330343039302c393135353936312c32363434373235392c38323132323330352c34363733343737312c32323332343235392c33313938383132302c35393339363137322c33373233303131322c35343535343034372c313432303235342c31343139343035362c3130353035363138372c35373435323234332c31333235333739312c32353238323431362c3131383733353536302c34323533363230352c373132303139352c37343032303038315d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a3134307d"
last_updated: 2026-08-03
---

# Decisions

## Decision Log

### Infer "always visible" table columns from position, not explicit config
**Date:** 2026-07-31
**Status:** Active
**Decision:** [`withResponsiveBreakpoints()`](mex://function:54b86f5d03fc7d414f96708c8c778140) decides which columns stay always-visible purely from column shape/position (a leading `preview` action column plus the first two labeled columns after it) rather than accepting an `alwaysVisibleKeys` parameter from each call site.
**Reasoning:** The first version required every one of the 8 table components to pass an explicit list of "always visible" column keys. The user's direction: prefer auto-inferring APIs over explicit per-call-site config lists wherever the "special" cases can be inferred from shape/position instead.
**Alternatives considered:** Keep the explicit `alwaysVisibleKeys` parameter (rejected — required updating every call site whenever a table's columns changed, and duplicated information already implicit in column order).
**Consequences:** Column order in each `*List.vue` now has semantic meaning (first two labeled columns are load-bearing for visibility) — don't reorder columns in a list page without checking whether that changes what stays visible on small screens.

### Rebuild scratch/midgard-portal-nuxt features in Nuxt UI, never copy PrimeVue code as-is
**Date:** 2026-05-31 (repo start) — ongoing through at least 2026-07-31
**Status:** Active
**Decision:** `scratch/midgard-portal-nuxt/` (gitignored, PrimeVue-based, v0.8.1) is the source-of-truth reference for product features and data shapes, but every port into this app is rebuilt using Nuxt UI components — never copied verbatim.
**Reasoning:** This app started as the stock Nuxt UI Pro dashboard template and is being reskinned into "The Lost Kingdom" RPG campaign manager; the user's own PrimeVue prototype already has the full feature set (character sheets, bestiary, stamm reference data, dice roller, PDF export) but the target UI stack is Nuxt UI + UnoCSS, not PrimeVue.
**Alternatives considered:** Copy scratch's PrimeVue components directly and re-theme (rejected — the point of the rewrite is the Nuxt UI/UnoCSS stack, not just the visual theme).
**Consequences:** Data-layer code (Pinia stores, Zod-adjacent models) that's UI-framework-agnostic was carried over largely as-is; every `.vue` component was rebuilt. When a new feature request sounds like it might already exist, check `scratch/midgard-portal-nuxt/app/` first — it very likely defines the actual expected behavior even if not stated explicitly.

### Swap Tailwind for UnoCSS via `unocss-nuxt-ui`
**Date:** 2026-07-13
**Status:** Active
**Decision:** Run Nuxt UI on UnoCSS instead of Tailwind. `@sfxcode/nuxt-ui-mongocamp` pulls in `unocss-nuxt-ui` as a module dependency, which removes the Tailwind Vite plugin entirely.
**Reasoning:** Comes bundled with the auth module the user maintains; adopting it avoided running two utility-CSS engines side by side.
**Alternatives considered:** Keep Tailwind and configure the auth module to skip its UnoCSS setup (not pursued — not clearly supported by the module, and would fight the module's own defaults).
**Consequences:** Any custom theme token (colors, fonts, radius) must be plain CSS custom properties (`:root { --color-*: ... }`), not Tailwind-specific at-rules like `@theme` — those are silently dropped by browsers once Tailwind's engine is gone, with no build error or warning.

### Replace `@3d-dice/dice-ui`'s `DisplayResults` with a custom component
**Date:** 2026-07-22
**Status:** Active
**Decision:** Built `app/components/dice/DiceResultDisplay.vue` instead of using `@3d-dice/dice-ui`'s `DisplayResults` widget for rendering dice roll results.
**Reasoning:** `DisplayResults` had three real bugs found during integration: the method is `showResults()` not `show()`; it requires a specific `data.rolls`/`data.value` shape that `diceBox.getRollResults()` doesn't produce directly; and its total fallback sums all dice including ones flagged `drop`/`reroll`, which is wrong per the library's own documented example.
**Alternatives considered:** Patch around `DisplayResults`' input-shape requirements at the call site (rejected — the drop/reroll total bug would still need a workaround, so a from-scratch component ended up simpler and verifiable against the library's own docs example).
**Consequences:** `@3d-dice/dice-ui` is currently an unused dependency (still in `package.json`) — a removal candidate if not picked up again for something else.
