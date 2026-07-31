<script setup lang="ts">
const items = [{ label: 'Roles' }]

useSeoMeta({
  title: 'Roles'
})
</script>

<template>
  <UDashboardPanel id="admin-roles">
    <template #header>
      <AppPageHeader title="Roles" :items="items" />
    </template>

    <template #body>
      <MongocampRoles grants-path="/secured/admin/roles" />
    </template>
  </UDashboardPanel>
</template>
