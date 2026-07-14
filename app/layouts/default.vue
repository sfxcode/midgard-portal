<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const toast = useToast()
const mongocampStorage = useMongocampStorage()
const profile = computed(() => mongocampStorage.value.profile)

const open = ref(false)

const links = computed(() => [[{
  label: 'Account',
  icon: 'i-lucide-home',
  to: '/secured',
  exact: true,
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
  : []), {
  type: 'label',
  label: 'Demo Dashboard'
}, {
  label: 'Character Sheet',
  icon: 'i-lucide-user',
  to: '/secured/demo',
  exact: true,
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Quest Log',
  icon: 'i-lucide-scroll',
  to: '/secured/demo/inbox',
  badge: '4',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Party Members',
  icon: 'i-lucide-users-2',
  to: '/secured/demo/customers',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Campaign Config',
  to: '/secured/demo/settings',
  icon: 'i-lucide-shield-cog',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'Campaign Setup',
    to: '/secured/demo/settings',
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'NPCs & Allies',
    to: '/secured/demo/settings/members',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Game Events',
    to: '/secured/demo/settings/notifications',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Campaign Access',
    to: '/secured/demo/settings/security',
    onSelect: () => {
      open.value = false
    }
  }]
}], [{
  label: 'Discord Community',
  icon: 'i-lucide-message-square',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}, {
  label: 'Game Manual',
  icon: 'i-lucide-book',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}]] satisfies NavigationMenuItem[][])

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.value.flat().filter((item: NavigationMenuItem) => item.type !== 'label')
}, {
  id: 'code',
  label: 'Code',
  items: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages${route.path === '/secured/demo' ? '/secured/demo/index' : route.path}.vue`,
    target: '_blank'
  }]
}])

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: 'We use first-party cookies to enhance your experience on our website.',
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
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
          class="font-display"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto font-display"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
