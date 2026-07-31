<script setup lang="ts">
const items = [{ label: 'Users' }]

useSeoMeta({
  title: 'Users'
})
</script>

<template>
  <UDashboardPanel id="admin-users">
    <template #header>
      <UDashboardNavbar title="Users">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <MongocampUsers />
    </template>
  </UDashboardPanel>
</template>
