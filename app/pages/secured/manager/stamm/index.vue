<script setup lang="ts">
useSeoMeta({
  title: 'Stammdaten'
})
</script>

<template>
  <UDashboardPanel id="stamm">
    <template #header>
      <AppPageHeader title="Stammdaten" :items="[{ label: 'Stammdaten' }]" />
    </template>

    <template #body>
      <StammdatenBox class="lg:max-w-3xl" />
    </template>
  </UDashboardPanel>
</template>
