<script setup lang="ts">
import type { Kampagne } from '~/models'

const route = useRoute()
const idParameter = `${route.params.id}`

const { eigeneKampagnenAlsSpieler } = useKampagneStore()

const kampagne = computed(() => eigeneKampagnenAlsSpieler.value?.find((k: Kampagne) => k._id === idParameter))

const items = computed(() => [
  { label: 'Spieler', icon: 'i-lucide-users', to: '/secured/spieler' },
  { label: 'Kampagnen', icon: 'i-lucide-scroll', to: '/secured/spieler/kampagnen' },
  { label: kampagne.value?.name ?? idParameter }
])

useSeoMeta({
  title: kampagne.value?.name ?? 'Kampagne'
})
</script>

<template>
  <UDashboardPanel :id="`spieler-kampagne-${idParameter}`">
    <template #header>
      <UDashboardNavbar :title="kampagne?.name ?? 'Kampagne'">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <UCard v-if="kampagne" class="max-w-lg">
        <SpielerKampagneView :kampagne="kampagne" />
      </UCard>
      <p v-else class="text-sm text-muted">
        Diese Kampagne existiert nicht oder du bist nicht als Spieler eingetragen.
      </p>
    </template>
  </UDashboardPanel>
</template>
