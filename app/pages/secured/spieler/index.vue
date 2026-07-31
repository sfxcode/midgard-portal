<script setup lang="ts">
import type { Spieler } from '~/models'
import { useSpieler } from '~/composables/spieler/useSpieler'

const { aktuellerSpieler, refetchAktuellerSpieler } = useSpielerStore()
const { saveSpieler } = useSpieler()

async function handleSave(data: Partial<Spieler>) {
  if (!aktuellerSpieler.value) return
  await saveSpieler({ ...aktuellerSpieler.value, ...data })
  await refetchAktuellerSpieler()
}

const items = [{ label: 'Spieler' }]

useSeoMeta({
  title: 'Meine Daten'
})
</script>

<template>
  <UDashboardPanel id="spieler-profil">
    <template #header>
      <AppPageHeader title="Meine Daten" :items="items" />
    </template>

    <template #body>
      <UCard v-if="aktuellerSpieler" class="max-w-lg">
        <SpielerProfilView :spieler="aktuellerSpieler" :on-save="handleSave" />
      </UCard>
      <p v-else class="text-sm text-muted">
        Lade Spielerdaten…
      </p>
    </template>
  </UDashboardPanel>
</template>
