<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Typ } from '~/models'
import { useTypenExport } from '~/composables/stamm/useTypenExport'

const PreviewButton = resolveComponent('PreviewButton')
const TypViewComponent = resolveComponent('StammdatenTypView')

const table = useTemplateRef('table')

const { typen } = useStammdatenStore()
const { uniqueValues } = useArrayFunctions()
const { exportToCsv } = useCsvExport()
const { exportTypenData } = useTypenExport()
const { sortableHeader, multiSelectableHeader, searchableHeader, multiSelectFilter } = useTableColumnHeader()

const kategorien = computed(() => uniqueValues(typen.value, v => v.kategorie))

const columns = computed<TableColumn<Typ>[]>(() => withResponsiveBreakpoints([
  {
    id: 'preview',
    cell: ({ row }) =>
      h(PreviewButton, {}, () => h(TypViewComponent, { typ: row.original }))
  },
  {
    accessorKey: 'name',
    header: searchableHeader<Typ>('Name'),
    filterFn: 'includesString',
    cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/manager/stamm/typen/${row.original.name}`, class: 'text-primary hover:underline' }, () => row.original.name)
  },
  { accessorKey: 'kategorie', header: multiSelectableHeader<Typ>('Kategorie', () => kategorien.value.map(k => ({ label: k, value: k })), { allLabel: 'Alle Kategorien' }), filterFn: multiSelectFilter },
  { accessorKey: 'nameKurz', header: sortableHeader<Typ>('Bez.') },
  { accessorKey: 'buch', header: sortableHeader<Typ>('Buch') }
]))

const { columnVisibility } = useResponsiveColumnVisibility(columns)

const globalFilter = ref('')

const pagination = ref({ pageIndex: 0, pageSize: 10 })

function exportData() {
  const rows = (table.value?.tableApi?.getFilteredRowModel().rows ?? []).map(r => r.original)
  exportToCsv(rows, [
    { key: 'name', label: 'Name' },
    { key: 'nameKurz', label: 'Bez.' },
    { key: 'kategorie', label: 'Kategorie' },
    { key: 'buch', label: 'Buch' }
  ], 'typen')
}

function exportPdf() {
  const rows = (table.value?.tableApi?.getFilteredRowModel().rows ?? []).map(r => r.original)
  exportTypenData(rows, 'Typen Blatt')
}

const items = [
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/manager/stamm' },
  { label: 'Typen' }
]

useSeoMeta({
  title: 'Typen'
})
</script>

<template>
  <UDashboardPanel id="stamm-typen">
    <template #header>
      <AppPageHeader title="Typen" :items="items">
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
            @click="exportData"
          />
          <UButton
            label="PDF"
            icon="i-lucide-file-text"
            color="neutral"
            variant="subtle"
            @click="exportPdf"
          />
        </template>
      </AppPageHeader>
    </template>

    <template #body>
      <div class="flex flex-col gap-3">
        <UTable
          ref="table"
          v-model:global-filter="globalFilter"
          v-model:pagination="pagination"
          :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
          :column-visibility="columnVisibility"
          :data="typen"
          :columns="columns"
          :ui="{ th: 'align-top' }"
        >
          <template #empty>
            <p class="py-6 text-center text-sm text-muted">
              Keine Typen gefunden.
            </p>
          </template>
        </UTable>

        <TableFooter :table-api="table?.tableApi">
          <p class="text-sm text-muted">
            {{ table?.tableApi?.getFilteredRowModel().rows.length ?? typen?.length ?? 0 }} Typen
          </p>
        </TableFooter>
      </div>
    </template>
  </UDashboardPanel>
</template>
