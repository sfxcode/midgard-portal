<script setup lang="ts">
const route = useRoute()
const param = `${route.params.typ}`
const isElf = !!route.query.elf

const items = [
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/stamm' },
  { label: 'Typen', icon: 'i-lucide-list', to: '/secured/stamm/typen' },
  { label: param, to: `/secured/stamm/typen/${param}` },
  { label: 'Fertigkeiten' }
]

useSeoMeta({
  title: `${param} · Fertigkeiten`
})
</script>

<template>
  <UDashboardPanel :id="`stamm-typ-${param}-fertigkeiten`">
    <template #header>
      <UDashboardNavbar :title="`${param} · Fertigkeiten`">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <StammdatenFertigkeitenList :typ-name="param" :is-elf="isElf" />
    </template>
  </UDashboardPanel>
</template>
