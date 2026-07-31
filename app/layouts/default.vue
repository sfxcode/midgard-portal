<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const toast = useToast()
const mongocampStorage = useMongocampStorage()
const profile = computed(() => mongocampStorage.value.profile)
const { isManager } = useMongocampRoles()

const open = ref(false)

const links = computed(() => [{
  label: 'Account',
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
  icon: 'i-lucide-user',
  to: '/secured/spieler/abenteurer',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Kampagnen',
  icon: 'i-lucide-scroll',
  to: '/secured/spieler/kampagnen',
  onSelect: () => {
    open.value = false
  }
}, ...(profile.value.isAdmin
  ? [{
      type: 'label' as const,
      label: 'Administration'
    }, {
      label: 'Users',
      icon: 'i-lucide-users',
      to: '/secured/admin/users',
      onSelect: () => {
        open.value = false
      }
    }, {
      label: 'Roles',
      icon: 'i-lucide-shield',
      to: '/secured/admin/roles',
      onSelect: () => {
        open.value = false
      }
    }]
  : []), ...(isManager.value
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
        icon: 'i-lucide-wand-sparkles',
        to: '/secured/manager/stamm/zauber',
        onSelect: () => {
          open.value = false
        }
      }, {
        label: 'Fertigkeiten',
        icon: 'i-lucide-swords',
        to: '/secured/manager/stamm/fertigkeiten',
        onSelect: () => {
          open.value = false
        }
      }, {
        label: 'Typen',
        icon: 'i-lucide-shapes',
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
      icon: 'i-lucide-users',
      to: '/secured/manager/spielergruppen',
      onSelect: () => {
        open.value = false
      }
    }]
  : []), {
  type: 'label' as const,
  label: 'DM'
}, {
  label: 'NPC',
  icon: 'i-lucide-skull',
  to: '/secured/dm/npc',
  defaultOpen: true,
  type: 'trigger' as const,
  children: [{
    label: 'Bestiarium',
    icon: 'i-lucide-list',
    to: '/secured/dm/npc/bestiarium',
    onSelect: () => {
      open.value = false
    }
  }]
}, {
  label: 'Kampagnen',
  icon: 'i-lucide-scroll',
  to: '/secured/dm/kampagnen',
  onSelect: () => {
    open.value = false
  }
}] satisfies NavigationMenuItem[])

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.value.filter((item: NavigationMenuItem) => item.type !== 'label')
}])

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: 'The Lost Kingdom keeps a few cookies to remember your seat at the table.',
    duration: 0,
    close: false,
    actions: [{
      label: 'Accept',
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: 'Opt out',
      color: 'neutral',
      variant: 'ghost'
    }]
  })
})
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
