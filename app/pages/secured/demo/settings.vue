<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links = [[{
  label: 'Campaign Setup',
  icon: 'i-lucide-map',
  to: '/secured/demo/settings',
  exact: true
}, {
  label: 'NPCs & Allies',
  icon: 'i-lucide-users-2',
  to: '/secured/demo/settings/members'
}, {
  label: 'Game Events',
  icon: 'i-lucide-bell',
  to: '/secured/demo/settings/notifications'
}, {
  label: 'Campaign Access',
  icon: 'i-lucide-key',
  to: '/secured/demo/settings/security'
}], [{
  label: 'Game Wiki',
  icon: 'i-lucide-book-open',
  to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
  target: '_blank'
}]] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardPanel id="campaign-config" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Campaign Config">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>
