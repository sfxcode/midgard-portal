<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const props = defineProps<{
  title: string
  items?: BreadcrumbItem[]
}>()

// One icon per section, so every breadcrumb trail looks the same across pages
const crumbIcons: Record<string, string> = {
  Spieler: 'i-lucide-users',
  Abenteurer: 'i-game-icons-hood',
  Kampagnen: 'i-game-icons-scroll-unfurled',
  DM: 'i-game-icons-castle',
  NPC: 'i-game-icons-skull-crossed-bones',
  Bestiarium: 'i-game-icons-dragon-head',
  Stammdaten: 'i-lucide-database',
  Zauber: 'i-game-icons-wizard-staff',
  Fertigkeiten: 'i-game-icons-crossed-swords',
  Typen: 'i-game-icons-open-book',
  Spielergruppen: 'i-game-icons-three-friends',
  Benutzer: 'i-lucide-users',
  Rollen: 'i-game-icons-round-shield',
  Startseite: 'i-lucide-home',
  Credits: 'i-lucide-heart-handshake'
}

// On phones, parent crumbs (links) shrink to their icon; the current page keeps its label
const crumbs = computed(() => props.items?.map(item => ({
  ...item,
  icon: (item.label && crumbIcons[item.label]) || item.icon,
  ...(item.to ? { ui: { linkLabel: 'max-sm:hidden' } } : {})
})))

const { logout } = useMongocampAuth()
const colorMode = useColorMode()

const colorModes = [
  { label: 'Tag', value: 'light', icon: 'i-lucide-sun' },
  { label: 'Nacht', value: 'dark', icon: 'i-lucide-moon' },
  { label: 'System', value: 'system', icon: 'i-lucide-monitor' }
]

function onLogout() {
  logout()
  navigateTo('/login')
}
</script>

<template>
  <UDashboardNavbar :title="title" :ui="{ title: 'rpg-page-title' }">
    <template #leading>
      <UDashboardSidebarCollapse />
    </template>

    <template #right>
      <USelect
        v-model="colorMode.preference"
        :items="colorModes"
        value-key="value"
        class="w-28"
        aria-label="Darstellung"
      />

      <UButton
        label="Abmelden"
        icon="i-lucide-log-out"
        color="neutral"
        variant="subtle"
        class="max-sm:[&>span:not(.iconify)]:hidden"
        aria-label="Abmelden"
        @click="onLogout"
      />
    </template>
  </UDashboardNavbar>

  <UDashboardToolbar v-if="items?.length || $slots.center || $slots.right" class="flex-wrap gap-y-2">
    <div class="flex flex-1 items-center gap-1.5 min-w-0">
      <UBreadcrumb
        v-if="crumbs?.length"
        :items="crumbs"
      />
    </div>

    <div class="flex items-center gap-1.5 max-sm:order-last max-sm:w-full [&>*]:max-sm:w-full [&>*]:max-sm:max-w-none">
      <slot name="center" />
    </div>

    <div class="flex flex-1 items-center justify-end gap-1.5">
      <slot name="right" />
    </div>
  </UDashboardToolbar>
</template>
