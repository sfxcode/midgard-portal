<script setup lang="ts">
import type { FertigkeitLerneinheit, ZauberLerneinheit } from '~/models'
import { useBeschreibung } from '~/composables/stamm/useBeschreibung'

const route = useRoute()
const param = `${route.params.typ}`

const { typen } = useStammdatenStore()
const { zauberLerneinheiten, zauberLerneinheitenByTyp } = useZauberStore()
const { fertigkeitenLerneinheiten, fertigkeitenLerneinheitenByTyp } = useFertigkeitenStore()
const { beschreibung, loadBeschreibung } = useBeschreibung()
const { sortableHeader } = useSortableColumn()

const typ = computed(() => typen.value?.find(t => t.name === param))

const zauberLE = computed(() => (zauberLerneinheiten.value ? zauberLerneinheitenByTyp(param) : []))
const fertigkeitenLE = computed(() => (fertigkeitenLerneinheiten.value ? fertigkeitenLerneinheitenByTyp(param) : []))

const fertigkeitenLernkostenColumns = [
  { accessorKey: 'kategorie', header: sortableHeader<FertigkeitLerneinheit>('Kategorie') },
  { accessorKey: 'kosten', header: sortableHeader<FertigkeitLerneinheit>('Kosten') }
]

const zauberLernkostenColumns = [
  { accessorKey: 'kategorie', header: sortableHeader<ZauberLerneinheit>('Kategorie') },
  { accessorKey: 'kosten', header: sortableHeader<ZauberLerneinheit>('Kosten') }
]

onMounted(async () => {
  await loadBeschreibung(param, 'Typ')
})

const lerntabelleZauber = `/secured/stamm/typen/${param}/zauber`
const lerntabelleFertigkeiten = `/secured/stamm/typen/${param}/fertigkeiten`

const items = [
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/stamm' },
  { label: 'Typen', icon: 'i-lucide-list', to: '/secured/stamm/typen' },
  { label: param }
]

useSeoMeta({
  title: param
})
</script>

<template>
  <UDashboardPanel :id="`stamm-typ-${param}`">
    <template #header>
      <UDashboardNavbar :title="param">
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
        <div class="flex flex-col gap-6">
          <UCard v-if="typ">
            <StammdatenTypView :typ="typ" />
          </UCard>

          <div class="flex flex-col gap-6 sm:flex-row">
            <UCard class="flex-1">
              <p class="font-display text-lg text-highlighted mb-3">
                Lernkosten Fertigkeiten
              </p>
              <UTable :data="fertigkeitenLE" :columns="fertigkeitenLernkostenColumns" />
              <div class="pt-4 text-center">
                <NuxtLink :to="lerntabelleFertigkeiten" class="text-sm text-primary hover:underline">
                  Lerntabelle Fertigkeiten
                </NuxtLink>
              </div>
            </UCard>

            <UCard v-if="zauberLE.length > 0" class="flex-1">
              <p class="font-display text-lg text-highlighted mb-3">
                Lernkosten Zauber
              </p>
              <UTable :data="zauberLE" :columns="zauberLernkostenColumns" />
              <div class="pt-4 text-center">
                <NuxtLink :to="lerntabelleZauber" class="text-sm text-primary hover:underline">
                  Lerntabelle Zauber
                </NuxtLink>
              </div>
            </UCard>
          </div>
        </div>

        <UCard v-if="beschreibung">
          <StammdatenBeschreibungView :beschreibung="beschreibung" />
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
