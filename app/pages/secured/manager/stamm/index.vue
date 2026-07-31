<script setup lang="ts">
useSeoMeta({
  title: 'Stammdaten'
})
</script>

<template>
  <UDashboardPanel id="stamm">
    <template #header>
      <AppPageHeader title="Stammdaten" />
    </template>

    <template #body>
      <StammdatenBox />
    </template>
  </UDashboardPanel>
</template>
