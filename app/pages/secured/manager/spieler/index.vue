<script setup lang="ts">
const items = [{ label: 'Spieler' }]

const globalFilter = ref('')

useSeoMeta({
  title: 'Spieler'
})
</script>

<template>
  <UDashboardPanel id="manager-spieler">
    <template #header>
      <AppPageHeader title="Spieler" :items="items">
        <template #center>
          <UInput
            v-model="globalFilter"
            icon="i-lucide-search"
            placeholder="Globale Suche"
            class="max-w-xs"
          />
        </template>
      </AppPageHeader>
    </template>

    <template #body>
      <SpielerProfilListe v-model:global-filter="globalFilter" />
    </template>
  </UDashboardPanel>
</template>
