---
name: conventions
description: How code is written in this project — naming, structure, patterns, and style. Load when writing new code or reviewing existing code.
triggers:
  - "convention"
  - "pattern"
  - "naming"
  - "style"
  - "how should I"
  - "what's the right way"
edges:
  - target: context/architecture.md
    condition: when a convention depends on understanding the system structure
  - target: context/stack.md
    condition: when a convention is specific to how a particular library/technology is used here
  - target: patterns/add-list-page.md
    condition: when the convention concerns list/table pages specifically
  - target: patterns/debug-composable-gotchas.md
    condition: when a convention violation is suspected as the cause of a silent failure
grounds_to:
  - node: "function:36438aad1fcd886cdac7b41f2951f47b"
    fingerprint: "mh:64:7b226d696e68617368223a5b3136343536333038302c3134323037373935372c34373037303039302c3230393939373631332c34373830363431312c35373037323531342c3139323031373130362c3130333434373737352c36303232333137322c32373536353437312c393039393633342c3230333132353533332c3230353633383434342c32313034343836352c3136313530393532322c3331353038343833392c3135363939333132302c36383938303239312c3230363133383832302c3132373139343932322c3333303739313431362c3133373737373232352c3235393930343134362c33313332343535302c343935373133332c3331333033353830382c35303238343738362c32333930353139302c3132393938373839302c36303238353337372c32383736313331342c34353035343635382c32373733383333372c3134343331313935322c3338323930333831362c313934333631382c32333831333630342c35343439373334392c3131333638353436382c3133323233333533372c36353530383733302c3232323434343836352c3832363536312c3239313639373435362c39373531363434342c39333838383936352c3238333735333938302c3134353032313330352c34303434373932392c35373136363733392c38323531313430312c38353538393134392c3232333137333434342c3138393638373638322c38353336313636392c31343139343035362c34363934393831332c3536303838373339332c3239363332303833352c34323230353736322c31363935373433312c3133373938363137332c32333032383630312c34313330363839375d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a34307d"
last_updated: 2026-08-03
---

# Conventions

## Naming
- Composables: `use*` camelCase, one per file, matching filename (`useZauber.ts` exports `useZauber`). Domain composables live in nested folders: `composables/stamm/`, `composables/dm/`, `composables/spieler/`, `composables/tools/`.
- Components: PascalCase, grouped by domain into subfolders (`components/dice/`, `components/dm/`, `components/spieler/`, `components/stammdaten/`) mirroring the composables layout.
- German domain terms are used verbatim and untranslated in routes, component names, and UI labels (`Zauber`, `Fertigkeiten`, `Spieler`, `Kampagnen`, `Bestiarium`, `Typen`) alongside English system chrome (`Users`, `Roles`, `Administration`, `Home`) — this split is intentional, not an inconsistency to fix.
- Shared types live in a single `app/types/index.d.ts`, imported via `~/types` — don't scatter per-feature `.d.ts` files.
- Imports: single quotes, no semicolons, no `.ts` extension (`import { useWesen } from '~/composables/dm/useWesen'`).

## Structure
- Every domain entity (Zauber, Fertigkeiten, Typen, Wesen, Abenteurer, Spieler, Spielergruppen, Kampagnen) has a Pinia store (`use*Store()`) wrapping a `@pinia/colada` query, auto-imported regardless of folder nesting under `app/stores/`.
- **Composables under a nested subfolder (`composables/stamm/*`, `composables/dm/*`, `composables/spieler/*`, `composables/tools/*`) are NOT auto-imported** — Nuxt only auto-imports `composables/*.ts` (top level). Every call site needs an explicit import. ESLint and `nuxt typecheck` do **not** catch a missing one — this has to be checked by eye or by running the page.
- Every secured page's header goes through `AppPageHeader` (title/breadcrumb via props, `#center`/`#right` slots) — never a raw `UDashboardNavbar`.
- Every `UTable`'s footer (count/pagination/reset) goes through `TableFooter`, fed by [`withResponsiveBreakpoints()`](mex://function:54b86f5d03fc7d414f96708c8c778140) + [`useResponsiveColumnVisibility()`](mex://function:c5e0b9a8a07f34c139897de98d4fcb61) for column visibility — no per-table breakpoint config needed, it's inferred purely from column shape/position (a leading `preview` action column plus the first two labeled columns stay always-visible; everything else gets an auto-assigned `sm→2xl` tier, two per tier).
- Shared `UTable` styling (`base`/`thead`/`tbody`/`th`/`td`) lives in `app/app.config.ts`'s `ui.table.slots` — a per-component `:ui` override is only for genuine divergence.

## Patterns

**1. Never `resolveComponent('X')` by string inside a `.ts` composable.** Nuxt UI components aren't globally registered — a bare `resolveComponent()` call in a composable only resolves if the *calling* `.vue` file's own template still happens to reference that tag elsewhere. It fails silently (no error, blank render) the moment that stops being true.
```ts
// Wrong — depends on caller's template still using <USelect> somewhere
h(resolveComponent('USelect'), { ... })

// Correct — resolves regardless of any caller's template
import { USelect } from '#components'
h(USelect, { ... })
```

**2. `*View.vue` components used both in a list-preview popover and a detail-page edit form must keep `onSave` optional and gate the edit button on it.**
```ts
// Correct
onSave: { type: Function as PropType<(data: Partial<T>) => Promise<void> | void>, default: undefined }
```
```html
<UButton v-if="onSave" ... @click="toggleEditMode" />
```
```ts
async function handleSave(data) {
  await props.onSave?.(data)
  editMode.value = false
}
```
A required `onSave` with an unguarded edit button lets a read-only preview render a working-looking edit button that throws `onSave is not a function` on submit.

**3. A multi-select-over-scalar-column filter must check membership from the filter-array side, not the row side.** TanStack's built-in `'arrIncludesSome'` assumes the *row's* value is array-like — wrong for a single-valued column. Use [`multiSelectFilter()`](mex://function:36438aad1fcd886cdac7b41f2951f47b) (`(row, columnId, filterValue) => filterValue.includes(row.getValue(columnId))`) for any new multi-select-over-scalar column instead.

**4. A `computed()` that reads a `useTemplateRef()` value must not also be rendered directly in that same component's `<template>`.** This produces an unfixable vue-tsc circular-inference error (`TS7022`) that an explicit return-type annotation does not fix. If the value needs to appear in the template, inline the expression there instead of naming a `computed` for it.

## Verify Checklist
Before presenting any code:
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] Any new composable under a nested `composables/<subfolder>/` has explicit imports at every call site (lint/typecheck will NOT catch a missing one)
- [ ] Any new/edited `*View.vue` used in both a list preview and a detail page keeps `onSave` optional with a `v-if` guard on the edit button
- [ ] No `resolveComponent('X')`-by-string added inside a `.ts`/`.js` composable — import from `#components` instead
- [ ] Any auth-gated behavior change is verified with a genuine hard navigation (`page.goto`/reload), not just a client-side click-through after login
