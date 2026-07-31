<script setup lang="ts">
import { useSpielergruppe } from '~/composables/spieler/useSpielergruppe'

const items = [{ label: 'Spielergruppen' }]

const { login } = useSpielerStore()
const { refetchSpielergruppen } = useSpielergruppenStore()
const { createSpielergruppe, saveSpielergruppe } = useSpielergruppe()

const globalFilter = ref('')

const isCreateModalOpen = ref(false)
const name = ref('')
const creating = ref(false)

async function createNewSpielergruppe() {
  if (name.value.trim().length < 2) return
  creating.value = true
  try {
    const mitglieder = login.value ? [login.value] : []
    const result = await saveSpielergruppe(createSpielergruppe(name.value.trim(), mitglieder))
    await refetchSpielergruppen()
    if (result._id) {
      await navigateTo(`/secured/manager/spielergruppen/${result._id}`)
    }
  } finally {
    creating.value = false
  }
}

useSeoMeta({
  title: 'Spielergruppen'
})
</script>

<template>
  <UDashboardPanel id="manager-spielergruppen">
    <template #header>
      <AppPageHeader title="Spielergruppen" :items="items">
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
            icon="i-lucide-plus"
            aria-label="Gruppe anlegen"
            @click="isCreateModalOpen = true"
          />
        </template>
      </AppPageHeader>
    </template>

    <template #body>
      <UModal v-model:open="isCreateModalOpen" title="Gruppe anlegen">
        <template #body>
          <div class="flex flex-col gap-2">
            <UInput v-model="name" placeholder="Name" @keyup.enter="createNewSpielergruppe" />
            <UButton
              label="Gruppe anlegen"
              icon="i-lucide-plus"
              :loading="creating"
              :disabled="name.trim().length < 2"
              @click="createNewSpielergruppe"
            />
          </div>
        </template>
      </UModal>

      <SpielerGruppenListe v-model:global-filter="globalFilter" />
    </template>
  </UDashboardPanel>
</template>
