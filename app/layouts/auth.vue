<template>
  <div
    class="min-h-screen min-h-dvh flex flex-col items-center justify-center gap-7 p-6 relative bg-cover bg-center bg-no-repeat"
    style="background-image: url(/images/landing_page/landing_gridless.webp)"
  >
    <!--
      Vignette scrim: keeps the ~30% average darkening for mood, but eases
      off in the parchment centre (where the ink text lives) and deepens
      toward the wooden edges so the document appears candle-lit.
    -->
    <div
      class="absolute inset-0"
      style="background: radial-gradient(120% 95% at 50% 44%, rgb(0 0 0 / 0.14) 0%, rgb(0 0 0 / 0.26) 55%, rgb(0 0 0 / 0.52) 100%)"
    />

    <!--
      Brand block, written in ink directly on the photographed parchment:
      engraved Cinzel title, then a gold rule-and-diamond ornament, then a
      letterspaced small-caps eyebrow. Ink hexes are pinned (parchment-950 /
      gold-600 / gold-800 from main.css) so they cannot invert in dark mode.
    -->
    <div class="relative flex flex-col items-center gap-3 text-center">
      <h1 class="font-display font-semibold text-3xl text-[#2E1D0A] tracking-[0.05em]">
        The Lost Kingdom
      </h1>
      <div
        class="flex items-center gap-2.5"
        aria-hidden="true"
      >
        <span class="block h-px w-12 bg-gradient-to-l from-[#96691F]/80 to-transparent" />
        <span class="block size-1.5 rotate-45 border border-[#96691F]" />
        <span class="block h-px w-12 bg-gradient-to-r from-[#96691F]/80 to-transparent" />
      </div>
      <p class="font-display text-[0.6875rem] uppercase tracking-[0.32em] text-[#63421A]">
        Campaign Manager
      </p>
    </div>

    <!--
      Transparent card over the parchment. The white ring read as invisible
      on paper, so the frame is now a cartographic double border: a 1px ink
      ring plus a fainter hairline offset 4px outside it, like an old map.
    -->
    <UCard
      class="relative w-full max-w-sm"
      :ui="{
        root: 'bg-transparent rounded-xs shadow-none ring-1 ring-[#4E4130]/45 outline outline-1 outline-offset-4 outline-[#4E4130]/20',
        body: 'p-6 sm:p-8 gap-4 flex flex-col'
      }"
    >
      <slot />
    </UCard>
  </div>
</template>
