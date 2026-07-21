<script setup lang="ts">
import { useWesen } from '~/composables/dm/useWesen'

const items = [
  { label: 'NPC', icon: 'i-lucide-skull', to: '/secured/dm/npc' },
  { label: 'Bestiarium' }
]

const { documentApi } = useMongocampApi()
const { ensureMetaData } = useMongocampDocument()
const { createWesen } = useWesen()
const { refetchWesen } = useBestiariumStore()

const name = ref('')
const creating = ref(false)

async function createNewWesen() {
  if (name.value.trim().length < 2) return
  creating.value = true
  try {
    const requestBody = ensureMetaData(createWesen(name.value.trim())) as unknown as Record<string, string>
    await documentApi.insert({ collectionName: 'ms_bestiarium', requestBody })
    await refetchWesen()
    await navigateTo(`/secured/dm/npc/bestiarium/${name.value.trim()}`)
  } finally {
    creating.value = false
  }
}

useSeoMeta({
  title: 'Bestiarium'
})
</script>

<template>
  <UDashboardPanel id="dm-npc-bestiarium">
    <template #header>
      <UDashboardNavbar title="Bestiarium">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="mb-6 flex items-center gap-2">
        <UInput v-model="name" placeholder="Name des neuen Wesens" @keyup.enter="createNewWesen" class="w-50" />
        <UButton
          label="Eintrag anlegen"
          icon="i-lucide-plus"
          :loading="creating"
          :disabled="name.trim().length < 2"
          @click="createNewWesen"
        />
      </div>

      <DmWesenList />
    </template>
  </UDashboardPanel>
</template>
