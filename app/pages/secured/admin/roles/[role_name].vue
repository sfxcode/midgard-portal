<script setup lang="ts">
const route = useRoute()
const roleName = route.params.role_name as string

const items = [
  { label: 'Roles', icon: 'i-lucide-shield', to: '/secured/admin/roles' },
  { label: roleName }
]

useSeoMeta({
  title: `Role: ${roleName}`
})
</script>

<template>
  <UDashboardPanel :id="`admin-role-${roleName}`">
    <template #header>
      <UDashboardNavbar :title="`Role · ${roleName}`">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <MongocampRoleGrants :role-name="roleName" />
    </template>
  </UDashboardPanel>
</template>
