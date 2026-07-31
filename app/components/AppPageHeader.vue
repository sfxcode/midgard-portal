<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

defineProps<{
  title: string
  items?: BreadcrumbItem[]
}>()

const { logout } = useMongocampAuth()

function onLogout() {
  logout()
  navigateTo('/login')
}
</script>

<template>
  <UDashboardNavbar :title="title">
    <template #leading>
      <UDashboardSidebarCollapse />
    </template>

    <template #right>
      <UColorModeSelect />

      <UButton
        label="Logout"
        icon="i-lucide-log-out"
        color="neutral"
        variant="subtle"
        @click="onLogout"
      />
    </template>
  </UDashboardNavbar>

  <UDashboardToolbar v-if="items?.length">
    <UBreadcrumb :items="items" />
  </UDashboardToolbar>
</template>
