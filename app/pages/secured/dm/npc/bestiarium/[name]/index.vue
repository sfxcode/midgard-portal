<script setup lang="ts">
import type { Wesen } from '~/models'
import { useStammEdit } from '~/composables/stamm/useStammEdit'

const route = useRoute()
const nameParameter = `${route.params.name}`

const { refetchWesen, wesenByName } = useBestiariumStore()
const { saveStammDocument } = useStammEdit()

const wesenData = computed(() => wesenByName(nameParameter))

async function handleWesenSave(data: Partial<Wesen>) {
  if (!wesenData.value) return
  await saveStammDocument('ms_bestiarium', { ...wesenData.value, ...data })
  await refetchWesen()
}

const items = [
  { label: 'NPC', icon: 'i-lucide-skull', to: '/secured/dm/npc' },
  { label: 'Bestiarium', icon: 'i-lucide-list', to: '/secured/dm/npc/bestiarium' },
  { label: nameParameter }
]

useSeoMeta({
  title: nameParameter
})
</script>

<template>
  <UDashboardPanel :id="`dm-npc-bestiarium-${nameParameter}`">
    <template #header>
      <AppPageHeader :title="nameParameter" :items="items" />
    </template>

    <template #body>
      <UCard v-if="wesenData" class="max-h-screen overflow-y-auto xl:w-4/5 2xl:w-3/5">
        <DmWesenView :wesen="wesenData" :on-save="handleWesenSave" />
      </UCard>
    </template>
  </UDashboardPanel>
</template>
