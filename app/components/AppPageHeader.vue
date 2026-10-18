<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

defineProps<{
  title: string
  items?: BreadcrumbItem[]
}>()

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
  <UDashboardNavbar :title="title">
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
      <UBreadcrumb v-if="items?.length" :items="items" />
    </div>

    <div class="flex items-center gap-1.5 max-sm:order-last max-sm:w-full [&>*]:max-sm:w-full [&>*]:max-sm:max-w-none">
      <slot name="center" />
    </div>

    <div class="flex flex-1 items-center justify-end gap-1.5">
      <slot name="right" />
    </div>
  </UDashboardToolbar>
</template>
