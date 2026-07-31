<script setup lang="ts">
const items = [{ label: 'Users' }]

useSeoMeta({
  title: 'Users'
})
</script>

<template>
  <UDashboardPanel id="admin-users">
    <template #header>
      <AppPageHeader title="Users" :items="items" />
    </template>

    <template #body>
      <MongocampUsers />
    </template>
  </UDashboardPanel>
</template>
