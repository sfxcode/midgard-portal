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

const list = useTemplateRef('list')
const globalFilter = ref('')

const isCreateModalOpen = ref(false)
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
      <AppPageHeader title="Bestiarium" :items="items">
        <template #center>
          <UInput
            v-model="globalFilter"
            icon="i-lucide-search"
            placeholder="Globale Suche"
            class="max-w-xs"
          />
        </template>

        <template #right>
          <UButton
            label="CSV"
            icon="i-lucide-download"
            color="neutral"
            variant="subtle"
            @click="list?.exportData()"
          />
          <UButton
            icon="i-lucide-plus"
            aria-label="Eintrag anlegen"
            @click="isCreateModalOpen = true"
          />
        </template>
      </AppPageHeader>
    </template>

    <template #body>
      <UModal v-model:open="isCreateModalOpen" title="Eintrag anlegen">
        <template #body>
          <div class="flex flex-col gap-2">
            <UInput
              v-model="name"
              placeholder="Name des neuen Wesens"
              @keyup.enter="createNewWesen"
            />
            <UButton
              label="Eintrag anlegen"
              icon="i-lucide-plus"
              :loading="creating"
              :disabled="name.trim().length < 2"
              @click="createNewWesen"
            />
          </div>
        </template>
      </UModal>

      <DmWesenList ref="list" v-model:global-filter="globalFilter" />
    </template>
  </UDashboardPanel>
</template>
