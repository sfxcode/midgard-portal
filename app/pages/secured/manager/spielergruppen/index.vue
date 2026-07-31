<script setup lang="ts">
import { useSpielergruppe } from '~/composables/spieler/useSpielergruppe'

const items = [{ label: 'Spielergruppen' }]

const { login } = useSpielerStore()
const { refetchSpielergruppen } = useSpielergruppenStore()
const { createSpielergruppe, saveSpielergruppe } = useSpielergruppe()

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
      <AppPageHeader title="Spielergruppen" :items="items" />
    </template>

    <template #body>
      <div class="mb-6 flex flex-wrap items-center gap-2">
        <UInput v-model="name" placeholder="Name" class="w-50" />
        <UButton
          label="Gruppe anlegen"
          icon="i-lucide-plus"
          :loading="creating"
          :disabled="name.trim().length < 2"
          @click="createNewSpielergruppe"
        />
      </div>

      <SpielerGruppenListe />
    </template>
  </UDashboardPanel>
</template>
