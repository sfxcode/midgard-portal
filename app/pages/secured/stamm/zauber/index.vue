<script setup lang="ts">
const items = [
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/stamm' },
  { label: 'Zauber' }
]

useSeoMeta({
  title: 'Zauber'
})
</script>

<template>
  <UDashboardPanel id="stamm-zauber">
    <template #header>
      <UDashboardNavbar title="Zauber">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <StammdatenZauberList typ-name="" />
    </template>
  </UDashboardPanel>
</template>
