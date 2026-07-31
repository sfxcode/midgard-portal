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

  <UDashboardToolbar v-if="items?.length || $slots.center || $slots.right">
    <div class="flex flex-1 items-center gap-1.5">
      <UBreadcrumb v-if="items?.length" :items="items" />
    </div>

    <div class="flex items-center gap-1.5">
      <slot name="center" />
    </div>

    <div class="flex flex-1 items-center justify-end gap-1.5">
      <slot name="right" />
    </div>
  </UDashboardToolbar>
</template>
