<script setup lang="ts">
const items = [
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/manager/stamm' },
  { label: 'Zauber' }
]

const list = useTemplateRef('list')
const globalFilter = ref('')

useSeoMeta({
  title: 'Zauber'
})
</script>

<template>
  <UDashboardPanel id="stamm-zauber">
    <template #header>
      <AppPageHeader title="Zauber" :items="items">
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
      <StammdatenZauberList ref="list" v-model:global-filter="globalFilter" typ-name="" />
    </template>
  </UDashboardPanel>
</template>
