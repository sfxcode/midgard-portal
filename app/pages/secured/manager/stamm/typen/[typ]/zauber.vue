<script setup lang="ts">
const route = useRoute()
const param = `${route.params.typ}`
const isElf = !!route.query.elf

const items = [
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/manager/stamm' },
  { label: 'Typen', icon: 'i-lucide-list', to: '/secured/manager/stamm/typen' },
  { label: param, to: `/secured/manager/stamm/typen/${param}` },
  { label: 'Zauber' }
]

useSeoMeta({
  title: `${param} · Zauber`
})
</script>

<template>
  <UDashboardPanel :id="`stamm-typ-${param}-zauber`">
    <template #header>
      <AppPageHeader :title="`${param} · Zauber`" :items="items" />
    </template>

    <template #body>
      <StammdatenZauberList :typ-name="param" :is-elf="isElf" />
    </template>
  </UDashboardPanel>
</template>
