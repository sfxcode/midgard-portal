<script setup lang="ts">
import type { Abenteurer } from '~/models'
import { useStammEdit } from '~/composables/stamm/useStammEdit'

const route = useRoute()
const idParameter = `${route.params.id}`

const { abenteurer, refetchAbenteurer } = useAbenteurerStore()
const { saveStammDocument } = useStammEdit()

const abenteurerData = computed(() => abenteurer.value?.find((a: Abenteurer) => a._id === idParameter))

async function handleAbenteurerSave(data: Partial<Abenteurer>) {
  if (!abenteurerData.value) return
  await saveStammDocument('ms_abenteurer', { ...abenteurerData.value, ...data })
  await refetchAbenteurer()
}

const items = computed(() => [
  { label: 'Spieler', icon: 'i-lucide-users', to: '/secured/spieler' },
  { label: 'Abenteurer', icon: 'i-lucide-list', to: '/secured/spieler/abenteurer' },
  { label: abenteurerData.value?.name ?? idParameter }
])

useSeoMeta({
  title: abenteurerData.value?.name ?? 'Abenteurer'
})
</script>

<template>
  <UDashboardPanel :id="`spieler-abenteurer-${idParameter}`">
    <template #header>
      <UDashboardNavbar :title="abenteurerData?.name ?? 'Abenteurer'">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <UCard v-if="abenteurerData" class="max-h-screen overflow-y-auto xl:w-4/5 2xl:w-3/5">
        <SpielerAbenteurerView :abenteurer="abenteurerData" :on-save="handleAbenteurerSave" />
      </UCard>
    </template>
  </UDashboardPanel>
</template>
