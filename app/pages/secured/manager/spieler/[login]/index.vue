<script setup lang="ts">
import type { Spieler } from '~/models'
import { useSpieler } from '~/composables/spieler/useSpieler'

const route = useRoute()
const loginParameter = `${route.params.login}`

const { spieler, refetchSpieler } = useSpielerStore()
const { saveSpieler } = useSpieler()

const spielerData = computed(() => spieler.value?.find((s: Spieler) => s.login === loginParameter))

async function handleSpielerSave(data: Partial<Spieler>) {
  if (!spielerData.value) return
  await saveSpieler({ ...spielerData.value, ...data })
  await refetchSpieler()
}

const items = computed(() => [
  { label: 'Spieler', icon: 'i-lucide-users', to: '/secured/manager/spieler' },
  { label: spielerData.value?.name ?? loginParameter }
])

useSeoMeta({
  title: spielerData.value?.name ?? 'Spieler'
})
</script>

<template>
  <UDashboardPanel :id="`manager-spieler-${loginParameter}`">
    <template #header>
      <AppPageHeader :title="spielerData?.name ?? 'Spieler'" :items="items" />
    </template>

    <template #body>
      <UCard v-if="spielerData" class="max-w-lg">
        <SpielerProfilView :spieler="spielerData" :on-save="handleSpielerSave" />
      </UCard>
    </template>
  </UDashboardPanel>
</template>
