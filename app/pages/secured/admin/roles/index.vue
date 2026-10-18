<script setup lang="ts">
const items = [{ label: 'Rollen' }]

useSeoMeta({
  title: 'Rollen'
})
</script>

<template>
  <UDashboardPanel id="admin-roles">
    <template #header>
      <AppPageHeader title="Rollen" :items="items" />
    </template>

    <template #body>
      <MongocampRoles grants-path="/secured/admin/roles" />
    </template>
  </UDashboardPanel>
</template>
