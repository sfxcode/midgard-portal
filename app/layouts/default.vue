<script setup lang="ts">
import type { CommandPaletteItem, NavigationMenuItem } from '@nuxt/ui'

const mongocampStorage = useMongocampStorage()
const profile = computed(() => mongocampStorage.value.profile)
const { isManager } = useMongocampRoles()

const { zauber } = useZauberStore()
const { fertigkeiten } = useFertigkeitenStore()
const { typen } = useStammdatenStore()
const { wesen } = useBestiariumStore()
const { abenteurer } = useAbenteurerStore()
const { spieler } = useSpielerStore()
const { spielergruppen } = useSpielergruppenStore()
const { kampagnen } = useKampagneStore()

const open = ref(false)

const links = computed(() => [{
  label: 'Startseite',
  icon: 'i-lucide-home',
  to: '/secured',
  exact: true,
  onSelect: () => {
    open.value = false
  }
}, {
  type: 'label' as const,
  label: 'Spieler'
}, {
  label: 'Abenteurer',
  icon: 'i-game-icons-hood',
  to: '/secured/spieler/abenteurer',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Meine Kampagnen',
  icon: 'i-game-icons-scroll-unfurled',
  to: '/secured/spieler/kampagnen',
  onSelect: () => {
    open.value = false
  }
}, {
  type: 'label' as const,
  label: 'DM'
}, {
  label: 'NPC',
  icon: 'i-game-icons-skull-crossed-bones',
  to: '/secured/dm/npc',
  defaultOpen: true,
  type: 'trigger' as const,
  children: [{
    label: 'Bestiarium',
    icon: 'i-game-icons-dragon-head',
    to: '/secured/dm/npc/bestiarium',
    onSelect: () => {
      open.value = false
    }
  }]
}, {
  label: 'Spielleiter-Kampagnen',
  icon: 'i-game-icons-castle',
  to: '/secured/dm/kampagnen',
  onSelect: () => {
    open.value = false
  }
}, ...(isManager.value
  ? [{
      type: 'label' as const,
      label: 'Management'
    }, {
      label: 'Stamm',
      icon: 'i-lucide-database',
      to: '/secured/manager/stamm',
      defaultOpen: true,
      type: 'trigger' as const,
      children: [{
        label: 'Zauber',
        icon: 'i-game-icons-wizard-staff',
        to: '/secured/manager/stamm/zauber',
        onSelect: () => {
          open.value = false
        }
      }, {
        label: 'Fertigkeiten',
        icon: 'i-game-icons-crossed-swords',
        to: '/secured/manager/stamm/fertigkeiten',
        onSelect: () => {
          open.value = false
        }
      }, {
        label: 'Typen',
        icon: 'i-game-icons-open-book',
        to: '/secured/manager/stamm/typen',
        onSelect: () => {
          open.value = false
        }
      }]
    }, {
      label: 'Spieler',
      icon: 'i-lucide-user-cog',
      to: '/secured/manager/spieler',
      onSelect: () => {
        open.value = false
      }
    }, {
      label: 'Spielergruppen',
      icon: 'i-game-icons-three-friends',
      to: '/secured/manager/spielergruppen',
      onSelect: () => {
        open.value = false
      }
    }]
  : []), ...(profile.value.isAdmin
  ? [{
      type: 'label' as const,
      label: 'Administration'
    }, {
      label: 'Benutzer',
      icon: 'i-lucide-users',
      to: '/secured/admin/users',
      onSelect: () => {
        open.value = false
      }
    }, {
      label: 'Rollen',
      icon: 'i-game-icons-round-shield',
      to: '/secured/admin/roles',
      onSelect: () => {
        open.value = false
      }
    }]
  : [])] satisfies NavigationMenuItem[])

// Chained shortcuts: press G, then the second key (shown as hints in the palette's "Gehe zu" group)
const shortcutTargets = computed(() => [
  { keys: 'g-h', to: '/secured' },
  { keys: 'g-a', to: '/secured/spieler/abenteurer' },
  { keys: 'g-k', to: '/secured/spieler/kampagnen' },
  { keys: 'g-b', to: '/secured/dm/npc/bestiarium' },
  ...(isManager.value
    ? [
        { keys: 'g-z', to: '/secured/manager/stamm/zauber' },
        { keys: 'g-f', to: '/secured/manager/stamm/fertigkeiten' },
        { keys: 'g-t', to: '/secured/manager/stamm/typen' }
      ]
    : [])
])

defineShortcuts(Object.fromEntries([
  ...['g-h', 'g-a', 'g-k', 'g-b', 'g-z', 'g-f', 'g-t'].map(keys => [keys, () => {
    const target = shortcutTargets.value.find(t => t.keys === keys)
    if (target) navigateTo(target.to)
  }])
]))

// Recently visited detail pages, for the palette (per-viewer convenience, kept in localStorage)
const route = useRoute()
const recent = useLocalStorage<{ label: string, to: string, icon: string }[]>('midgard-recent', [])

function describeRoute(path: string) {
  const segments = path.split('/').map(decodeURIComponent)
  const last = segments.at(-1) ?? ''
  if (/^\/secured\/dm\/npc\/bestiarium\/[^/]+$/.test(path)) return { label: last, icon: 'i-game-icons-dragon-head' }
  if (/^\/secured\/manager\/stamm\/zauber\/[^/]+$/.test(path)) return { label: last, icon: 'i-game-icons-wizard-staff' }
  if (/^\/secured\/manager\/stamm\/fertigkeiten\/[^/]+\/[^/]+$/.test(path)) return { label: last, icon: 'i-game-icons-crossed-swords' }
  if (/^\/secured\/manager\/stamm\/typen\/[^/]+$/.test(path)) return { label: last, icon: 'i-game-icons-open-book' }
  if (/^\/secured\/spieler\/abenteurer\/[^/]+$/.test(path)) {
    const name = abenteurer.value?.find(a => a._id === last)?.name
    return name ? { label: name, icon: 'i-game-icons-hood' } : null
  }
  if (/^\/secured\/dm\/kampagnen\/[^/]+$/.test(path)) {
    const name = kampagnen.value?.find(k => k._id === last)?.name
    return name ? { label: name, icon: 'i-game-icons-castle' } : null
  }
  return null
}

watch(() => route.path, (path) => {
  const info = describeRoute(path)
  if (!info) return
  recent.value = [{ ...info, to: path }, ...recent.value.filter(item => item.to !== path)].slice(0, 6)
}, { immediate: true })

const groups = computed(() => [...(recent.value.length
  ? [{
      id: 'recent',
      label: 'Zuletzt besucht',
      items: recent.value
    }]
  : []), {
  id: 'links',
  label: 'Gehe zu',
  items: links.value
    .filter((item: NavigationMenuItem) => item.type !== 'label')
    .map((item: NavigationMenuItem) => {
      const keys = shortcutTargets.value.find(t => t.to === item.to)?.keys
      return keys ? { ...item, kbds: keys.split('-').map(key => key.toUpperCase()) } : item
    }) as CommandPaletteItem[]
}, ...(isManager.value
  ? [{
      id: 'zauber',
      label: 'Zauber',
      items: (zauber.value ?? []).map(z => ({
        label: z.name,
        suffix: z.kategorie,
        icon: 'i-game-icons-wizard-staff',
        to: `/secured/manager/stamm/zauber/${z.name}`
      }))
    }, {
      id: 'fertigkeiten',
      label: 'Fertigkeiten',
      items: (fertigkeiten.value ?? []).map(f => ({
        label: f.name,
        suffix: f.kategorie,
        icon: 'i-game-icons-crossed-swords',
        to: `/secured/manager/stamm/fertigkeiten/${f.kategorie}/${f.name}`
      }))
    }, {
      id: 'typen',
      label: 'Typen',
      items: (typen.value ?? []).map(t => ({
        label: t.name,
        icon: 'i-game-icons-open-book',
        to: `/secured/manager/stamm/typen/${t.name}`
      }))
    }, {
      id: 'spieler',
      label: 'Spieler',
      items: (spieler.value ?? []).map(s => ({
        label: s.name,
        suffix: s.login,
        icon: 'i-lucide-user-cog',
        to: `/secured/manager/spieler/${s.login}`
      }))
    }, {
      id: 'spielergruppen',
      label: 'Spielergruppen',
      items: (spielergruppen.value ?? []).map(g => ({
        label: g.name,
        icon: 'i-game-icons-three-friends',
        to: `/secured/manager/spielergruppen/${g._id}`
      }))
    }]
  : []), {
  id: 'wesen',
  label: 'Bestiarium',
  items: (wesen.value ?? []).map(w => ({
    label: w.name,
    suffix: w.kategorie,
    icon: 'i-game-icons-dragon-head',
    to: `/secured/dm/npc/bestiarium/${w.name}`
  }))
}, {
  id: 'abenteurer',
  label: 'Abenteurer',
  items: (abenteurer.value ?? []).map(a => ({
    label: a.name,
    suffix: a.spieler,
    icon: 'i-game-icons-hood',
    to: `/secured/spieler/abenteurer/${a._id}`
  }))
}, {
  id: 'kampagnen',
  label: 'Kampagnen',
  items: (kampagnen.value ?? []).map(k => ({
    label: k.name,
    icon: 'i-game-icons-castle',
    to: `/secured/dm/kampagnen/${k._id}`
  }))
}])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links"
          orientation="vertical"
          tooltip
          popover
          class="font-display"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />
  </UDashboardGroup>
</template>
