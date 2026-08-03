---
name: mongocamp-auth-integration
description: Building or debugging any feature that depends on login/session state or role gating from @sfxcode/nuxt-ui-mongocamp — the module's docs don't cover these traps.
triggers:
  - "auth"
  - "login"
  - "session"
  - "useMongocampUser"
  - "useMongocampStorage"
  - "isAdmin"
  - "isManager"
  - "logged out"
  - "FormKit"
edges:
  - target: context/auth.md
    condition: for the full system-level description of this integration
  - target: context/architecture.md
    condition: for how auth fits into the overall request flow
grounds_to: []
last_updated: 2026-08-03
---

# MongoCamp Auth Integration

## Context
`@sfxcode/nuxt-ui-mongocamp` is the user's own published package (a REST client + UI components against a separate MongoCamp server, not a Mongo driver). It supplies auth entirely via globally auto-imported composables (`useMongocampStorage`, `useMongocampRoles`, `useMongocampUser`, `useMongocampAuth`) — there is no local plugin or middleware file in this repo to read for reference; the module's own source (installed under `node_modules/@sfxcode/nuxt-mongocamp-server`) is the ground truth when its docs are incomplete.

## Steps
1. For any new feature that needs to know who's logged in or what role they have, read `useMongocampStorage().value.profile` (via a `computed()`, as `app/layouts/default.vue` already does) — never `useMongocampUser()`.
2. For role gating on a whole route tree, don't hand-roll a check — rely on the module's `global-auth` middleware and the `securedRouteParts`/`managementRouteParts`/`adminRouteParts` config in `nuxt.config.ts`'s `nuxtUiMongocamp` block.
3. For a new form that needs a FormKit-based custom input, confirm it's registered via `formkit.config.ts`'s `createNuxtUiFormkitConfig()` — don't assume installing the module alone registers custom input types.

## Gotchas
- **`useMongocampUser()` is write-only, not the persisted session.** It's a bare `useState('mongocamp.user')` with no default and no rehydration — only ever set by `login()`/`logout()`. After any fresh page boot (hard reload, direct nav, or the client-only remount this app's `routeRules['/secured/**'].ssr = false` triggers), its `.value` is `undefined` even though the user is genuinely still logged in. This looked fine when tested by clicking through right after logging in, then crashed every `/secured/**` page on a hard reload — the bug only shows up under a genuine reload/direct-nav test.
- **`useMongocampStorage()` is a cookie (`useCookie`), not sessionStorage** — as of module ≥1.5.1 it's named `mongocamp-session` with a 30-day default `maxAge` (overridable via the module's `sessionMaxAge` option); earlier versions used a session-only cookie dropped when the browser process closed, which read as "gets logged out after closing the app." Being a cookie means it **is** sent with the initial SSR request — this app's own `routeRules['/secured/**'].ssr = false` comment blames sessionStorage for needing client-only rendering, which may now be partially stale (not yet verified safe to remove; other reasons for client-only rendering there — e.g. the 3D dice component — aren't ruled out).
- **`<FormKit>` renders nothing with no clear error if `formkit.config.ts` is missing or misconfigured** — the only symptom is a generic Vue warning: `Component FormKit is missing template or render function`, which doesn't point at FormKit config at all.
- **Test with a genuine hard navigation, not just a click-through.** Any state populated only in-memory during the login action itself (not rehydrated from persisted storage on boot) will look correct via client-side navigation right after logging in and misbehave on `page.goto()`/reload. This is the general rule for verifying anything in this integration.

## Verify
- [ ] A newly auth-dependent feature reads `useMongocampStorage().value.profile`, not `useMongocampUser()`, for anything that must survive a reload
- [ ] Tested via `page.goto()`/hard reload directly on the route, not only via a client-side link click after logging in
- [ ] Role-gated visibility (manager/admin sections) checked against `nuxt.config.ts`'s `nuxtUiMongocamp` route-part config, not a hand-rolled check
- [ ] Any new `<FormKit>`-based input type is registered in `formkit.config.ts`

## Debug
- Symptom: a sidebar/page computed property crashes on every `/secured/**` page after a hard reload → check for a read of `useMongocampUser()` where `useMongocampStorage().value.profile` should be used instead.
- Symptom: `<FormKit>` renders nothing, console shows only "missing template or render function" → check `formkit.config.ts` is present and its `inputs`/`plugins` are actually passed to the FormKit Nuxt module.
- Symptom: user reports being logged out after closing/reopening the browser → check the installed `@sfxcode/nuxt-mongocamp-server` version is ≥1.5.1 (transitively via `@sfxcode/nuxt-ui-mongocamp`); earlier versions have no `maxAge` on the session cookie.

## Update Scaffold
- [ ] Update `context/auth.md` if the `ssr: false` routeRule question above ever gets resolved (tested and either removed or confirmed still necessary for another reason)
- [ ] Update `.mex/ROUTER.md` "Known issues" once that's resolved
