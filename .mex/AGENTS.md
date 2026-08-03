---
name: agents
description: Always-loaded project anchor. Read this first. Contains project identity, non-negotiables, commands, and pointer to ROUTER.md for full context.
last_updated: 2026-08-03
---

# midgard-portal

## What This Is
A Nuxt 4 app being reskinned from the stock Nuxt UI Pro dashboard template into "The Lost Kingdom", a tabletop-RPG campaign manager, with auth and data access via the user's own `@sfxcode/nuxt-ui-mongocamp` package (a REST client to a separate MongoCamp server).

## Non-Negotiables
- Never copy PrimeVue code from `scratch/midgard-portal-nuxt/` as-is — it's the reference implementation for product features, but every port must be rebuilt with Nuxt UI components, not copied verbatim.
- Never read persisted session/user state from `useMongocampUser()` — it's write-only (set by `login()`/`logout()`), `undefined` on any hard reload. Use `useMongocampStorage().value.profile` instead.
- Every `*View.vue` in the stammdaten/DM family (`TypView`, `ZauberView`, `FertigkeitView`, `WesenView`) must keep `onSave` optional and gate its edit-toggle button on it — these components are reused read-only in list preview popovers.
- Theme tokens (`gold`/`parchment`/`crimson`/`moss` ramps, fonts, radius) live as plain `:root { --color-*: ... }` CSS custom properties in `app/assets/css/main.css` — never inside a Tailwind `@theme` block. This app runs UnoCSS, not Tailwind (via `unocss-nuxt-ui`, pulled in transitively).
- Any auth-gated behavior must be verified with a genuine hard navigation (`page.goto`/reload), not just a client-side click-through after login.

## Commands
- Dev: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck` (`nuxt typecheck`)
- Preview: `pnpm preview`
- CI (`.github/workflows/ci.yml`) runs lint + typecheck only, no tests, no deploy step.

## Code Graph
The repo is indexed into `.mex/graph.db`. Prefer graph commands over grepping or reading files.
- Explore a task with `mex graph scope "<task>"` first — it returns a compact JSONL manifest (`meta`, `fact`s, `summary`). Treat any source the graph returns as ALREADY READ; do not re-open those files.
- Pick 1-3 relevant node ids from the manifest and expand only those with `mex graph get <id> --detail source`.
- If you already know the symbol, skip scope: use `mex graph query <who-calls|what-calls|where-defined> <symbol>`, or `mex graph get <id>`.
- Before editing a symbol, run `mex impact <symbol|file>` to see affected callers and scaffold memory.
- If a result is `truncated`, do NOT repeat the broad query — narrow the task or use the summary's `suggestedNextCommands`. Scale through a few focused calls, never one giant response.
- Note: the graph indexes `.ts`/`.js` (composables, stores, models, utils) but not `.vue` SFC bodies — for component behavior, ground to the composables the component calls, not the component itself.
- During `mex sync`, adjudicate any AMBIGUOUS grounding; after repairs, ensure the refreshed grounding is re-emitted.

## Scaffold Growth
After meaningful work, run GROW:
- Ground: what changed in reality?
- Record: update `ROUTER.md` and relevant `context/` files
- Orient: create or update a `patterns/` runbook if this can recur
- Write: bump `last_updated` on changed scaffold files and run `mex log` when rationale matters

The scaffold grows from real work, not just setup. See the GROW step in `ROUTER.md` for details.

## Navigation
At the start of every session, read `ROUTER.md` before doing anything else.
For full project context, patterns, and task guidance — everything is there.
