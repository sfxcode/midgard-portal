<script setup lang="ts">
useSeoMeta({
  title: 'Roles'
})
</script>

<template>
  <UDashboardPanel id="admin-roles">
    <template #header>
      <UDashboardNavbar title="Roles">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <MongocampRoles grants-path="/secured/admin/roles" />
    </template>
  </UDashboardPanel>
</template>
