<script setup lang="ts">
const route = useRoute()
const param = `${route.params.typ}`
const isElf = !!route.query.elf

const items = [
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/stamm' },
  { label: 'Typen', icon: 'i-lucide-list', to: '/secured/stamm/typen' },
  { label: param, to: `/secured/stamm/typen/${param}` },
  { label: 'Zauber' }
]

useSeoMeta({
  title: `${param} · Zauber`
})
</script>

<template>
  <UDashboardPanel :id="`stamm-typ-${param}-zauber`">
    <template #header>
      <UDashboardNavbar :title="`${param} · Zauber`">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <StammdatenZauberList :typ-name="param" :is-elf="isElf" />
    </template>
  </UDashboardPanel>
</template>
