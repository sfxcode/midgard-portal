<script setup lang="ts">
const items = [
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/stamm' },
  { label: 'Fertigkeiten' }
]

useSeoMeta({
  title: 'Fertigkeiten'
})
</script>

<template>
  <UDashboardPanel id="stamm-fertigkeiten">
    <template #header>
      <UDashboardNavbar title="Fertigkeiten">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <StammdatenFertigkeitenList typ-name="" />
    </template>
  </UDashboardPanel>
</template>
