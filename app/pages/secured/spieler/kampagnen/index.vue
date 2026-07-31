<script setup lang="ts">
const items = [
  { label: 'Spieler', icon: 'i-lucide-users', to: '/secured/spieler' },
  { label: 'Kampagnen' }
]

const { eigeneKampagnenAlsSpieler } = useKampagneStore()

useSeoMeta({
  title: 'Kampagnen'
})
</script>

<template>
  <UDashboardPanel id="spieler-kampagnen">
    <template #header>
      <AppPageHeader title="Kampagnen" :items="items" />
    </template>

    <template #body>
      <SpielerKampagnenListe
        :kampagnen="eigeneKampagnenAlsSpieler ?? []"
        empty-text="Du bist in keiner Kampagne als Spieler eingetragen."
        base-path="/secured/spieler/kampagnen"
      />
    </template>
  </UDashboardPanel>
</template>
