<script setup lang="ts">
const items = [{ label: 'Roles' }]

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

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <MongocampRoles grants-path="/secured/admin/roles" />
    </template>
  </UDashboardPanel>
</template>
