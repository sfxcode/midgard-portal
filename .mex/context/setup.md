---
name: setup
description: Dev environment setup and commands. Load when setting up the project for the first time or when environment issues arise.
triggers:
  - "setup"
  - "install"
  - "environment"
  - "getting started"
  - "how do I run"
  - "local development"
edges:
  - target: context/stack.md
    condition: when specific technology versions or library details are needed
  - target: context/architecture.md
    condition: when understanding how components connect during setup
  - target: context/auth.md
    condition: when MONGOCAMP_* env vars or login fail to work locally
grounds_to: []
last_updated: 2026-08-03
---

# Setup

## Prerequisites
- Node.js 22 (matches the CI matrix in `.github/workflows/ci.yml`)
- pnpm (`pnpm-lock.yaml` is the lockfile in use)
- A running MongoCamp server to point `MONGOCAMP_URL` at — this app has no local/mock backend

## First-time Setup
1. `pnpm install`
2. Set `MONGOCAMP_URL` and `MONGOCAMP_API_KEY` env vars (see below) — required for login to work at all
3. `pnpm dev` (runs `nuxt prepare` automatically via the `postinstall` script first)

## Environment Variables
- `MONGOCAMP_URL` (required) — base URL of the MongoCamp REST server; read in `nuxt.config.ts`'s `mongocamp.url`
- `MONGOCAMP_API_KEY` (required) — API key for the MongoCamp server; read in `nuxt.config.ts`'s `mongocamp.apiKey`

## Common Commands
- `pnpm dev` — starts dev server on `http://localhost:3000`
- `pnpm build` — production build (`nuxt build`)
- `pnpm preview` — locally preview the production build
- `pnpm lint` — ESLint (flat config via `@nuxt/eslint`, extends the Nuxt-generated config)
- `pnpm typecheck` — `nuxt typecheck` (`vue-tsc`)
- `pnpm postinstall` — `nuxt prepare`, runs automatically after `pnpm install`

## Common Issues
**Login/auth doesn't work at all:** check `MONGOCAMP_URL`/`MONGOCAMP_API_KEY` are set — there's no local fallback or mock server.
**A page works right after login but breaks on reload:** don't use `useMongocampUser()` for anything that needs to survive a reload — it's write-only, `undefined` on a fresh page boot. Use `useMongocampStorage().value.profile` instead. See `context/auth.md`.
**A new nested composable (`composables/dm/*`, `composables/stamm/*`, etc.) silently does nothing, no error:** it's missing its explicit import — Nuxt only auto-imports top-level `composables/*.ts`, and neither ESLint nor `nuxt typecheck` catches a missing nested import.
**Custom theme colors/fonts/radius stop applying after touching `app/assets/css/main.css`:** check the tokens are defined as plain `:root { --color-*: ... }`, not inside a Tailwind `@theme` block — this app runs UnoCSS, not Tailwind, and `@theme` at-rules are silently dropped.
**"[Icon] failed to load icon" console warning:** an icon name assembled in `<script setup>` (e.g. a computed nav array) rather than written literally in a template needs an explicit entry in `nuxt.config.ts`'s `icon.clientBundle.icons` — the static scanner only catches template-literal icon strings.
