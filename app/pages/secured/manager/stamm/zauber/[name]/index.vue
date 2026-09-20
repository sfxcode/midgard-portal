<script setup lang="ts">
import type { Zauber } from '~/models'
import { useBeschreibung } from '~/composables/stamm/useBeschreibung'
import { useStammEdit } from '~/composables/stamm/useStammEdit'

const route = useRoute()
const nameParameter = `${route.params.name}`

const { refetchZauber, zauberByName } = useZauberStore()
const { beschreibung, beschreibungContent, loadBeschreibung, saveBeschreibung } = useBeschreibung()
const { saveStammDocument } = useStammEdit()

const zauberData = computed(() => zauberByName(nameParameter))

async function handleZauberSave(data: Partial<Zauber>) {
  if (!zauberData.value) return
  await saveStammDocument('ms_zauber', { ...zauberData.value, ...data })
  await refetchZauber()
}

onMounted(async () => {
  await loadBeschreibung(nameParameter, 'Zauber')
})

const items = [
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/manager/stamm' },
  { label: 'Zauber', icon: 'i-lucide-list', to: '/secured/manager/stamm/zauber' },
  { label: nameParameter }
]

useSeoMeta({
  title: nameParameter
})
</script>

<template>
  <UDashboardPanel :id="`stamm-zauber-${nameParameter}`">
    <template #header>
      <AppPageHeader :title="nameParameter" :items="items" />
    </template>

    <template #body>
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <UCard v-if="zauberData">
          <StammdatenZauberView :zauber="zauberData" :on-save="handleZauberSave" />
        </UCard>
        <UCard>
          <StammdatenBeschreibungView
            v-model:content="beschreibungContent"
            :beschreibung="beschreibung"
            :on-save="() => saveBeschreibung(nameParameter, 'Zauber')"
          />
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
