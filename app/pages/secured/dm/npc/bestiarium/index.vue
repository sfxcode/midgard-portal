<script setup lang="ts">
import type { Wesen } from '~/models'
import { useWesen } from '~/composables/dm/useWesen'

const items = [
  { label: 'NPC', icon: 'i-lucide-skull', to: '/secured/dm/npc' },
  { label: 'Bestiarium' }
]

const { documentApi } = useMongocampApi()
const { ensureMetaData } = useMongocampDocument()
const { createWesen } = useWesen()
const { wesen, refetchWesen } = useBestiariumStore()

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

// The seed file (data/bestiarium.json) is not committed and must not ship to production:
// a dynamic import would bundle it into a public client chunk, so the import is dev-only.
const isDev = import.meta.dev

async function loadWesenFromData() {
  if (!import.meta.dev) return
  const bestiarium_json = await import('../../../../../../data/bestiarium.json')
  const wesenList = bestiarium_json.default as unknown as Wesen[]
  const existingWesen = wesen.value ?? []
  const existingWesenNames = existingWesen.map(w => w.name)

  for (const entry of wesenList) {
    if (existingWesenNames.includes(entry.name)) {
      console.log(`Wesen ${entry.name} already exists, skipping...`)
      continue
    }
    try {
      const requestBody = ensureMetaData(entry) as unknown as Record<string, string>
      await documentApi.insert({ collectionName: 'ms_bestiarium', requestBody })
    } catch (error) {
      console.error('error', error)
    }
  }
  await refetchWesen()
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
            v-if="isDev"
            label="JSON"
            icon="i-lucide-upload"
            color="neutral"
            variant="subtle"
            @click="loadWesenFromData"
          />
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
