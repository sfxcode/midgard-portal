---
name: auth
description: How MongoCamp auth, session state, and role-gated routes work in this app — the traps in @sfxcode/nuxt-ui-mongocamp beyond its own docs.
triggers:
  - "auth"
  - "login"
  - "session"
  - "useMongocampUser"
  - "useMongocampStorage"
  - "role"
  - "isAdmin"
  - "isManager"
  - "secured route"
edges:
  - target: context/architecture.md
    condition: for how auth fits into the overall request flow
  - target: context/setup.md
    condition: for the MONGOCAMP_URL/MONGOCAMP_API_KEY env vars needed to log in at all
  - target: context/stack.md
    condition: for the module's place in the overall dependency stack
  - target: patterns/mongocamp-auth-integration.md
    condition: when building or debugging any auth-dependent feature
grounds_to: []
last_updated: 2026-08-03
---

# Auth (MongoCamp)

## System Overview
`@sfxcode/nuxt-ui-mongocamp` (the user's own published package) supplies everything auth-related as globally auto-imported composables — no local plugin or middleware file exists in `app/`. `app/layouts/default.vue` reads it directly: `const mongocampStorage = useMongocampStorage(); const profile = computed(() => mongocampStorage.value.profile)`. Nothing else in this app touches auth state.

The module's `global-auth` middleware (enabled via `useGlobalAuthMiddleware: true` in `nuxt.config.ts`'s `nuxtUiMongocamp` block) gates every route matching `securedRouteParts: ['/secured/**']`, redirecting to `/login` if not authenticated, and further gates `managementRouteParts: ['/secured/manager/**']` and `adminRouteParts: ['/secured/admin/**']` by role. `/logout` is an empty page — the middleware performs the actual logout as a side effect of matching that path.

`nuxt.config.ts`'s `routeRules` renders all of `/secured/**` client-only (`ssr: false`), with a code comment attributing this to auth state living in sessionStorage. That's now understood to be at least partially stale: `useMongocampStorage()` is actually a `useCookie` (see below), which **is** sent with the initial SSR request. The `ssr: false` rule may be partly legacy from before the module's storage mechanism changed — not yet verified safe to remove (other reasons for client-only rendering there, e.g. the 3D dice component, haven't been ruled out).

## Key Components
- **`useMongocampStorage()`** — the real, persisted source of truth. It's a `useCookie('mongocamp-session', { maxAge: ... })` under the hood (module version ≥1.5.1; the cookie was renamed from `mongocamp` and given a 30-day default `maxAge` in that release — before that it was a session-only cookie, dropped when the browser process closed). Read `.value.profile.user` / `.value.profile.isAdmin` from this for anything that must survive a reload.
- **`useMongocampUser()`** — a decoy for "get the current user." It's `useState('mongocamp.user')` with no default and no rehydration logic — only ever *written* by `login()`/`logout()` inside `useMongocampAuth()`. After any fresh page boot (hard reload, direct nav, the client-only remount from `ssr: false`), its `.value` is `undefined` even though the user is still genuinely logged in per `useMongocampStorage()`.
- **`useMongocampRoles()`** — role-derived booleans (`isManager`, etc.) used by the sidebar and page guards; used alongside `mongocampStorage.value.profile.isAdmin` for the admin-only sections.
- **`MongocampUsers` / `MongocampRoles`** — the module's own admin-UI components, used wholesale (not rebuilt) at `/secured/admin/users` and `/secured/admin/roles/**`.
- **`<FormKit>`** — used by the module's own login form and by this app's `FUDataEdit` forms. Requires `formkit.config.ts` at the project root (already present, wires `@sfxcode/nuxt-ui-formkit`'s `createNuxtUiFormkitConfig()`) — without it, `<FormKit>` renders nothing, with only a generic Vue "missing template or render function" warning as a clue.

## Role-Gated Route Groups
- `/secured/spieler/**` — visible to any logged-in user (player-facing: own profile, Abenteurer, Kampagnen joined as a player)
- `/secured/dm/**` — visible to any logged-in user, not role-gated (NPC/Bestiarium, DM's own Kampagnen)
- `/secured/manager/**` — visible when `isManager` (Stamm reference data, Spieler admin, Spielergruppen)
- `/secured/admin/**` — visible when `profile.isAdmin` (Users, Roles via the module's own components)

## What Does NOT Exist Here
- No local auth plugin, middleware, or session-refresh code — all of it is the module's `global-auth` middleware plus `tokenRefreshInterval`/`refreshToken` config in `nuxt.config.ts`.
- No password reset / signup flow in this app — login only, against a pre-provisioned MongoCamp user base.
