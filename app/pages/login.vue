<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Sign In'
})
</script>

<template>
  <div class="login-form">
    <!--
      Ink colours are pinned to the palette hexes (parchment-950 / -700)
      instead of text-highlighted/text-muted: the card is transparent over a
      light parchment photo, so theme-dependent colours would become
      illegible the moment the app switches to dark mode.
    -->
    <div class="text-center mb-6">
      <h2 class="font-display text-xl text-[#2E1D0A] tracking-wide">
        Enter the Kingdom
      </h2>
      <p class="mt-1.5 text-sm text-[#4E4130] font-serif italic">
        Sign in with your adventurer credentials to continue.
      </p>
    </div>

    <MongocampLogin />
  </div>
</template>

<style scoped>
/*
 * MongocampLogin renders its own layout shell — a half-width padded flex
 * column wrapping an opaque UPageCard — which fought our transparent card.
 * We cannot change its markup, so flatten it from outside: full width, no
 * inner card chrome, and the form fields laid directly on the parchment.
 */
.login-form :deep(.w-1\/2) {
  width: 100%;
  padding: 0;
}

/* The nested UPageCard: strip its background, ring, radius and padding. */
.login-form :deep(.w-1\/2 > [data-slot='root']) {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  max-width: none;
}

.login-form :deep(.w-1\/2 [data-slot='container']) {
  padding: 0;
}

/* Vertical rhythm for the form itself. */
.login-form :deep(.formkit-form) {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  width: 100%;
}

/* The component's own "Mongocamp Login" heading duplicates ours — hide it. */
.login-form :deep(.formkit-form > h3) {
  display: none;
}

.login-form :deep(.formkit-outer) {
  width: 100%;
}

.login-form :deep(.formkit-wrapper) {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
}

/* FormKit's inner wrapper and Nuxt UI's inline-flex input root both shrink
   to content — stretch them so the fields span the card like the button. */
.login-form :deep(.formkit-inner),
.login-form :deep(.formkit-inner [data-slot='root']) {
  width: 100%;
}

/* Field labels as small engraved ledger capitals, in ink. */
.login-form :deep(.formkit-label) {
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #3b3025;
}

/*
 * Inputs: a wash of paper-white so the fields read as fill-in boxes on the
 * document. Only background is overridden — ring and focus styles stay
 * Nuxt UI's own, so keyboard focus remains fully visible.
 */
.login-form :deep(input[data-slot='base']) {
  background-color: rgb(253 251 243 / 0.78);
  padding-block: 0.5rem;
  color: #2a211a;
}

/* Login is the page's one action: full-width, engraved, wax-seal gold. */
.login-form :deep(.formkit-actions) {
  width: 100%;
  margin-top: 0.25rem;
}

.login-form :deep(.formkit-actions button[type='submit']) {
  width: 100%;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9375rem;
  letter-spacing: 0.08em;
  padding-block: 0.625rem;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.14), 0 1px 2px rgb(46 29 10 / 0.35);
}

/* Dev-only debug accordion: keep it working, stop it competing. */
.login-form :deep(.formkit-debug) {
  margin-top: 0.5rem;
  opacity: 0.45;
  transition: opacity 150ms;
}

.login-form :deep(.formkit-debug [data-slot='root'] > button) {
  margin-inline: auto;
  width: auto;
  background: transparent;
  font-size: 0.8125rem;
  padding-block: 0.25rem;
  color: #4e4130; /* pinned ink — theme text colours invert in dark mode */
}

.login-form :deep(.formkit-debug:hover),
.login-form :deep(.formkit-debug:focus-within) {
  opacity: 1;
}

/* The component's error line ships as text-2xl red — restyle to a quiet
   crimson note beneath the form. */
.login-form :deep(.text-2xl.text-red-700) {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  text-align: center;
  color: #7a2124;
}
</style>
