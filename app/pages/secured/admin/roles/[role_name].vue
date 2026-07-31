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
      <AppPageHeader :title="`Role · ${roleName}`" :items="items" />
    </template>

    <template #body>
      <MongocampRoleGrants :role-name="roleName" />
    </template>
  </UDashboardPanel>
</template>
