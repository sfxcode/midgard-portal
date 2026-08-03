---
name: debug-composable-gotchas
description: Debug pattern for the most common failure boundary in this app — a composable/component silently renders blank or hangs, with zero errors from lint or typecheck. Four known root causes and how to tell them apart.
triggers:
  - "renders nothing"
  - "blank"
  - "silently fails"
  - "no error"
  - "console warning"
  - "page hangs"
  - "infinite loop"
  - "Failed to resolve component"
edges:
  - target: context/conventions.md
    condition: for the underlying conventions these gotchas are violations of
  - target: patterns/add-list-page.md
    condition: when the symptom shows up while adding a table column or header widget
grounds_to: []
last_updated: 2026-08-03
---

# Debug: Silent Composable/Component Failures

## Context
This app has no test suite — the only automated gates are `pnpm lint` and `pnpm typecheck`. Four real bugs found in this codebase all share the same shape: **both pass clean, and the only signal is a runtime symptom** (blank render, console warning, or a hang). When something "does nothing" with no thrown error, check these four causes in order before assuming the logic itself is wrong.

## Steps (diagnostic order)
1. **Missing nested composable import?** If the broken code calls a composable from `composables/dm/*`, `composables/stamm/*`, `composables/spieler/*`, or `composables/tools/*`, check the file has an explicit `import { useX } from '~/composables/<folder>/useX'` at the top. Nuxt only auto-imports top-level `composables/*.ts` — nested ones need an explicit import at every call site, and neither ESLint nor `nuxt typecheck` catches a missing one (confirmed directly: removing the import and running `npx eslint` on the file produces zero output).
2. **`resolveComponent('X')` inside a `.ts`/`.js` file?** If a render-function helper (e.g. a `TableColumn.header` builder) uses `h(resolveComponent('X'), ...)` and renders blank, check the browser console for `[Vue warn]: Failed to resolve component: X`. Nuxt UI components aren't globally registered — `resolveComponent()` from a composable only resolves if the *calling* `.vue` file's own template still references that tag somewhere, which is fragile and breaks the moment that template changes. Fix: `import { X } from '#components'` instead.
3. **A `@pinia/colada`-backed `use*Store()` called from inside another composable's function body** (not a component's top level)? If the page hangs (Playwright screenshot timeout, not a thrown error) and the console shows a *repeating* "onMounted/onServerPrefetch/onUnmounted called when there is no active component instance" warning, look for a store composable called inside a `computed()` getter or similar non-setup context. Each re-evaluation re-registers a new query subscription. Fix: pass the already-instantiated function in as a parameter from the component instead.
4. **A vue-tsc `TS7022` "implicitly any, circular" error** on a `computed()` that reads a `useTemplateRef()`? This happens specifically when that same `computed` is *also* referenced in the component's own `<template>`. An explicit return-type annotation does not fix it. Fix: inline the expression directly in the template instead of naming a `computed` for it.

## Gotchas
- None of these four show up as a lint or typecheck failure — don't trust a clean `pnpm lint`/`pnpm typecheck` run as proof the code is correct if the symptom is a blank render or a hang.
- The infinite-loop symptom (#3) does NOT throw — it's easy to mistake for a slow network request rather than a logic bug. Check for a *repeating* lifecycle warning specifically, not just any warning.

## Verify
- [ ] Reproduced the fix by actually running the page (dev server or Playwright), not just re-running lint/typecheck
- [ ] Console shows no `Failed to resolve component` or repeating lifecycle warnings after the fix
- [ ] If the fix was a missing import, confirmed the import matches this codebase's style (single quotes, no `.ts` extension, no trailing semicolon)

## Debug
If none of the four causes above match, the failure is likely genuinely new — check the browser console and network tab directly rather than re-reading the source for a logic error that isn't there.

## Update Scaffold
- [ ] If a fifth recurring silent-failure shape turns up, add it here as a numbered cause rather than creating a new pattern file
