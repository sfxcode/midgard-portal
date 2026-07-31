<script setup lang="ts">
const items = [{ label: 'Spieler' }]

useSeoMeta({
  title: 'Spieler'
})
</script>

<template>
  <UDashboardPanel id="manager-spieler">
    <template #header>
      <AppPageHeader title="Spieler" :items="items" />
    </template>

    <template #body>
      <SpielerProfilListe />
    </template>
  </UDashboardPanel>
</template>
