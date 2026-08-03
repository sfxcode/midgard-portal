---
name: router
description: Session bootstrap and navigation hub. Read at the start of every session before any task. Contains project state, routing table, and behavioural contract.
edges:
  - target: context/architecture.md
    condition: when working on system design, integrations, or understanding how components connect
  - target: context/stack.md
    condition: when working with specific technologies, libraries, or making tech decisions
  - target: context/conventions.md
    condition: when writing new code, reviewing code, or unsure about project patterns
  - target: context/decisions.md
    condition: when making architectural choices or understanding why something is built a certain way
  - target: context/setup.md
    condition: when setting up the dev environment or running the project for the first time
  - target: context/auth.md
    condition: when the task touches login, session state, or role-gated routes
  - target: patterns/INDEX.md
    condition: when starting a task — check the pattern index for a matching pattern file
last_updated: 2026-08-03
---

# Session Bootstrap

If you haven't already read `AGENTS.md`, read it now — it contains the project identity, non-negotiables, and commands.

Then read this file fully before doing anything else in this session.

## Current Project State

**Working:**
- Auth + role-gated routing via `@sfxcode/nuxt-ui-mongocamp` (`/secured/spieler/**`, `/secured/dm/**` for any logged-in user; `/secured/manager/**` for managers; `/secured/admin/**` for admins)
- Stamm reference data browsing + editing (Zauber, Fertigkeiten, Typen) with CSV/PDF export, under `/secured/manager/stamm/**`
- Player-facing Abenteurer (character) and Kampagnen (campaign) pages under `/secured/spieler/**`, plus Spieler/Spielergruppen admin under `/secured/manager/**`
- DM Bestiarium (Wesen/NPC browser+editor) and DM Kampagnen under `/secured/dm/**`
- 3D dice roller (`@3d-dice/dice-box`) on `/secured`
- Shared page chrome (`AppPageHeader`, `TableFooter`) and responsive column visibility (`useResponsiveColumns.ts`) applied across all list tables
- RPG theme (UnoCSS custom color ramps `gold`/`parchment`/`crimson`/`moss`, Cinzel/Alegreya fonts) applied app-wide

**Not yet built:**
- i18n — German domain terms and English chrome coexist untranslated; no `@nuxtjs/i18n` setup
- The Basis-Eigenschaften calculator (`scratch/`'s `templates/calculator.vue` + `components/calculator/BasisEigenschaft.vue`) — a point-buy character attribute tool with real Midgard-specific formulas; the only genuine unported feature (see `patterns/port-primevue-feature.md`). Everything else in `scratch/`'s remaining pages (`secured/tools/**`, `templates/blueprint.vue`, `templates/print.vue`, `secured/admin/index.vue`, `secured/stamm/lernen/zauber.vue`) is either an empty stub, dead placeholder content, or already superseded by a more complete equivalent in this app.
- No test suite (unit or e2e) — verification is lint + typecheck + manual/Playwright checks only
- No deployment configured — no known live URL

**Known issues:**
- `nuxt.config.ts`'s `routeRules['/secured/**'].ssr = false` comment attributes client-only rendering to sessionStorage-based auth state, but `useMongocampStorage()` is actually cookie-based (sent with SSR requests) as of module ≥1.5.1 — the rule may be partially legacy; not yet verified safe to remove (see `context/auth.md`)
- `@3d-dice/dice-ui` remains an unused dependency in `package.json` since its `DisplayResults` widget was replaced by a custom component

## Routing Table

Load the relevant file based on the current task. Always load `context/architecture.md` first if not already in context this session.

| Task type | Load |
|-----------|------|
| Understanding how the system works | `context/architecture.md` |
| Working with a specific technology | `context/stack.md` |
| Writing or reviewing code | `context/conventions.md` |
| Making a design decision | `context/decisions.md` |
| Setting up or running the project | `context/setup.md` |
| Login, session state, or role-gated routes | `context/auth.md` |
| Any specific task | Check `patterns/INDEX.md` for a matching pattern |

## Behavioural Contract

For every task, follow this loop:

1. **CONTEXT** — Load the relevant context file(s) from the routing table above. Check `patterns/INDEX.md` for a matching pattern. If one exists, follow it. Narrate what you load: "Loading architecture context..."
2. **BUILD** — Do the work. If a pattern exists, follow its Steps. If you are about to deviate from an established pattern, say so before writing any code — state the deviation and why.
3. **VERIFY** — Load `context/conventions.md` and run the Verify Checklist item by item. State each item and whether the output passes. Do not summarise — enumerate explicitly.
4. **DEBUG** — If verification fails or something breaks, check `patterns/INDEX.md` for a debug pattern. Follow it. Fix the issue and re-run VERIFY.
5. **GROW** — After meaningful work, run this binary checklist:
   - **Ground:** What changed in reality? Name the changed behavior, system, command, dependency, or workflow.
   - **Record:** If project state changed, update the "Current Project State" section above. If documented facts changed, update the relevant `context/` file surgically.
   - **Orient:** If this task can recur and no pattern exists, create one in `patterns/` using `patterns/README.md`, then add it to `patterns/INDEX.md`. If a pattern exists but you learned a gotcha, update it.
   - **Write:** Bump `last_updated` in every scaffold file you changed. If the why matters, run `mex log --type decision "<what changed and why>"` or `mex log "<note>"`.
