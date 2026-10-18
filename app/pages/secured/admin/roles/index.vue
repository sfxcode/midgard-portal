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
      <div class="rpg-frame rpg-module p-4">
        <MongocampRoles grants-path="/secured/admin/roles" />
      </div>
    </template>
  </UDashboardPanel>
</template>
