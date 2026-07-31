<script setup lang="ts">
import { useAbenteurer } from '~/composables/spieler/useAbenteurer'

const items = [
  { label: 'Spieler', icon: 'i-lucide-users', to: '/secured/spieler' },
  { label: 'Abenteurer' }
]

const { documentApi } = useMongocampApi()
const { ensureMetaData } = useMongocampDocument()
const { createAbenteurer } = useAbenteurer()
const { refetchAbenteurer } = useAbenteurerStore()
const { typNamen } = useStammdatenStore()

const list = useTemplateRef('list')

const isCreateModalOpen = ref(false)
const name = ref('')
const spieler = ref('')
const typ = ref('')
const creating = ref(false)

async function createNewAbenteurer() {
  if (name.value.trim().length < 2 || spieler.value.trim().length < 2 || !typ.value) return
  creating.value = true
  try {
    const requestBody = ensureMetaData(createAbenteurer(name.value.trim(), spieler.value.trim(), typ.value)) as unknown as Record<string, string>
    const result = await documentApi.insert({ collectionName: 'ms_abenteurer', requestBody })
    await refetchAbenteurer()
    const insertedId = result.insertedIds?.[0]
    if (insertedId) {
      await navigateTo(`/secured/spieler/abenteurer/${insertedId}`)
    }
  } finally {
    creating.value = false
  }
}

useSeoMeta({
  title: 'Abenteurer'
})
</script>

<template>
  <UDashboardPanel id="spieler-abenteurer">
    <template #header>
      <AppPageHeader title="Abenteurer" :items="items">
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
            aria-label="Abenteurer anlegen"
            @click="isCreateModalOpen = true"
          />
        </template>
      </AppPageHeader>
    </template>

    <template #body>
      <UModal v-model:open="isCreateModalOpen" title="Abenteurer anlegen">
        <template #body>
          <div class="flex flex-col gap-2">
            <UInput v-model="name" placeholder="Name" />
            <UInput v-model="spieler" placeholder="Spieler" />
            <USelect
              v-model="typ"
              :items="typNamen"
              placeholder="Typ"
            />
            <UButton
              label="Abenteurer anlegen"
              icon="i-lucide-plus"
              :loading="creating"
              :disabled="name.trim().length < 2 || spieler.trim().length < 2 || !typ"
              @click="createNewAbenteurer"
            />
          </div>
        </template>
      </UModal>

      <SpielerAbenteurerList ref="list" />
    </template>
  </UDashboardPanel>
</template>
