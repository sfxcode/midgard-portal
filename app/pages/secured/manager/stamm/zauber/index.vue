<script setup lang="ts">
const items = [
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/manager/stamm' },
  { label: 'Zauber' }
]

useSeoMeta({
  title: 'Zauber'
})
</script>

<template>
  <UDashboardPanel id="stamm-zauber">
    <template #header>
      <AppPageHeader title="Zauber" :items="items" />
    </template>

    <template #body>
      <StammdatenZauberList typ-name="" />
    </template>
  </UDashboardPanel>
</template>
