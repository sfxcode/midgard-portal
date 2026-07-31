<script setup lang="ts">
const items = [
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/manager/stamm' },
  { label: 'Fertigkeiten' }
]

useSeoMeta({
  title: 'Fertigkeiten'
})
</script>

<template>
  <UDashboardPanel id="stamm-fertigkeiten">
    <template #header>
      <AppPageHeader title="Fertigkeiten" :items="items" />
    </template>

    <template #body>
      <StammdatenFertigkeitenList typ-name="" />
    </template>
  </UDashboardPanel>
</template>
