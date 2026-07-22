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
      <UDashboardNavbar title="Abenteurer">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="mb-6 flex flex-wrap items-center gap-2">
        <UInput v-model="name" placeholder="Name" class="w-40" />
        <UInput v-model="spieler" placeholder="Spieler" class="w-40" />
        <USelect
          v-model="typ"
          :items="typNamen"
          placeholder="Typ"
          class="w-40"
        />
        <UButton
          label="Abenteurer anlegen"
          icon="i-lucide-plus"
          :loading="creating"
          :disabled="name.trim().length < 2 || spieler.trim().length < 2 || !typ"
          @click="createNewAbenteurer"
        />
      </div>

      <SpielerAbenteurerList />
    </template>
  </UDashboardPanel>
</template>
