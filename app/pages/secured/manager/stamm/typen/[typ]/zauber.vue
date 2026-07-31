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

const list = useTemplateRef('list')
const globalFilter = ref('')

useSeoMeta({
  title: `${param} · Zauber`
})
</script>

<template>
  <UDashboardPanel :id="`stamm-typ-${param}-zauber`">
    <template #header>
      <AppPageHeader :title="`${param} · Zauber`" :items="items">
        <template #center>
          <UInput
            v-model="globalFilter"
            icon="i-lucide-search"
            placeholder="Globale Suche"
            class="max-w-xs"
          />
        </template>

        <template #right>
          <UButton
            label="CSV"
            icon="i-lucide-download"
            color="neutral"
            variant="subtle"
            @click="list?.exportData()"
          />
          <UButton
            label="PDF"
            icon="i-lucide-file-text"
            color="neutral"
            variant="subtle"
            @click="list?.exportPdf()"
          />
        </template>
      </AppPageHeader>
    </template>

    <template #body>
      <StammdatenZauberList
        ref="list"
        v-model:global-filter="globalFilter"
        :typ-name="param"
        :is-elf="isElf"
      />
    </template>
  </UDashboardPanel>
</template>
