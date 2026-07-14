<script setup lang="ts">
import type { Fertigkeit } from '~/models'
import { useBeschreibung } from '~/composables/stamm/useBeschreibung'

const route = useRoute()
const kategorieParameter = `${route.params.kategorie}`
const fertigkeitParameter = `${route.params.fertigkeit}`

const { fertigkeiten } = useFertigkeitenStore()
const { beschreibung, loadBeschreibung } = useBeschreibung()

const fertigkeit = computed(() => {
  return fertigkeiten.value?.find((f: Fertigkeit) => f.name === fertigkeitParameter && f.kategorie === kategorieParameter)
})

onMounted(async () => {
  await loadBeschreibung(fertigkeitParameter, 'Fertigkeit')
})

const items = [
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/stamm' },
  { label: 'Fertigkeiten', icon: 'i-lucide-list', to: '/secured/stamm/fertigkeiten' },
  { label: fertigkeitParameter }
]

useSeoMeta({
  title: fertigkeitParameter
})
</script>

<template>
  <UDashboardPanel :id="`stamm-fertigkeit-${kategorieParameter}-${fertigkeitParameter}`">
    <template #header>
      <UDashboardNavbar :title="fertigkeitParameter">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <UCard v-if="fertigkeit">
          <StammdatenFertigkeitView :fertigkeit="fertigkeit" />
        </UCard>
        <UCard v-if="beschreibung">
          <StammdatenBeschreibungView :beschreibung="beschreibung" />
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
