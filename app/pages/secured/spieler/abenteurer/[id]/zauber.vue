<script setup lang="ts">
import type { Abenteurer } from '~/models'

const route = useRoute()
const idParameter = `${route.params.id}`

const { abenteurer } = useAbenteurerStore()

const abenteurerData = computed(() => abenteurer.value?.find((a: Abenteurer) => a._id === idParameter))

const items = computed(() => [
  { label: 'Spieler', icon: 'i-lucide-users', to: '/secured/spieler' },
  { label: 'Abenteurer', icon: 'i-lucide-list', to: '/secured/spieler/abenteurer' },
  { label: abenteurerData.value?.name ?? idParameter, to: `/secured/spieler/abenteurer/${idParameter}` },
  { label: 'Zauber' }
])

useSeoMeta({
  title: abenteurerData.value ? `Zauber - ${abenteurerData.value.name}` : 'Zauber'
})
</script>

<template>
  <UDashboardPanel :id="`spieler-abenteurer-${idParameter}-zauber`">
    <template #header>
      <UDashboardNavbar :title="abenteurerData ? `Zauber - ${abenteurerData.name}` : 'Zauber'">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <StammdatenZauberList v-if="abenteurerData" :typ-name="abenteurerData.typ" :zauber-filter="abenteurerData.zauber" />
    </template>
  </UDashboardPanel>
</template>
