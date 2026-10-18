<script setup lang="ts">
const items = [{ label: 'Benutzer' }]

useSeoMeta({
  title: 'Benutzer'
})
</script>

<template>
  <UDashboardPanel id="admin-users">
    <template #header>
      <AppPageHeader title="Benutzer" :items="items" />
    </template>

    <template #body>
      <MongocampUsers />
    </template>
  </UDashboardPanel>
</template>
