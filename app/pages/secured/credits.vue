<script setup lang="ts">
const items = [{ label: 'Credits' }]

useSeoMeta({
  title: 'Credits'
})

const shortcuts = [
  { keys: ['⌘/Strg', 'K'], text: 'Suche und Schnellsprung öffnen' },
  { keys: ['W'], text: 'Würfeltisch ein- und ausblenden' },
  { keys: ['G', 'H'], text: 'Startseite' },
  { keys: ['G', 'A'], text: 'Abenteurer' },
  { keys: ['G', 'K'], text: 'Meine Kampagnen' },
  { keys: ['G', 'B'], text: 'Bestiarium' },
  { keys: ['G', 'Z'], text: 'Zauber (Verwaltung)' },
  { keys: ['G', 'F'], text: 'Fertigkeiten (Verwaltung)' },
  { keys: ['G', 'T'], text: 'Typen (Verwaltung)' }
]

const credits = [
  {
    name: 'game-icons.net',
    text: 'Symbole für Navigation und Kacheln (Lorc, Delapouite und weitere Autoren).',
    license: 'CC BY 3.0',
    to: 'https://game-icons.net'
  },
  {
    name: 'Lucide',
    text: 'Allgemeine Oberflächen-Symbole.',
    license: 'ISC',
    to: 'https://lucide.dev'
  },
  {
    name: 'Cinzel & Alegreya',
    text: 'Schriften für Überschriften und Fließtext.',
    license: 'SIL OFL',
    to: 'https://fonts.google.com'
  },
  {
    name: 'dice-box',
    text: '3D-Würfel auf dem Würfeltisch.',
    license: 'MIT',
    to: 'https://github.com/3d-dice/dice-box'
  }
]
</script>

<template>
  <UDashboardPanel id="credits">
    <template #header>
      <AppPageHeader title="Credits" :items="items" />
    </template>

    <template #body>
      <div class="rpg-frame p-6 lg:max-w-3xl">
        <p class="rpg-section-title mb-4">
          Tastenkürzel
        </p>
        <ul class="grid gap-2 sm:grid-cols-2">
          <li v-for="shortcut in shortcuts" :key="shortcut.text" class="flex items-center gap-3 text-base">
            <span class="flex shrink-0 items-center gap-1">
              <UKbd v-for="key in shortcut.keys" :key="key" :value="key" />
            </span>
            <span class="text-muted">{{ shortcut.text }}</span>
          </li>
        </ul>
        <p class="mt-3 text-sm text-muted">
          Kürzel mit G: erst G, dann die zweite Taste drücken.
        </p>
      </div>

      <div class="rpg-frame p-6 lg:max-w-3xl">
        <p class="rpg-section-title mb-4">
          Mit Dank an
        </p>
        <ul class="flex flex-col gap-4">
          <li v-for="credit in credits" :key="credit.name">
            <ULink :to="credit.to" target="_blank" class="font-display text-primary hover:underline">
              {{ credit.name }}
            </ULink>
            <UBadge
              :label="credit.license"
              color="neutral"
              variant="subtle"
              size="sm"
              class="ml-2"
            />
            <p class="text-base text-muted">
              {{ credit.text }}
            </p>
          </li>
        </ul>
        <p class="text-sm text-muted mt-5">
          Inoffizielles Fan-Werkzeug für das Rollenspiel Midgard.
        </p>
      </div>
    </template>
  </UDashboardPanel>
</template>
