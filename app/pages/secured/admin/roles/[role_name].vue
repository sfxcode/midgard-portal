<script setup lang="ts">
const route = useRoute()
const roleName = route.params.role_name as string

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

        <template #right>
          <UButton
            label="Back to Roles"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="subtle"
            to="/secured/admin/roles"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <MongocampRoleGrants :role-name="roleName" />
    </template>
  </UDashboardPanel>
</template>
