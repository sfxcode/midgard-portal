<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Wesen } from '~/models'
import { useWesen } from '~/composables/dm/useWesen'

const UButton = resolveComponent('UButton')
const UPopover = resolveComponent('UPopover')
const WesenViewComponent = resolveComponent('DmWesenView')

const table = useTemplateRef('table')

const { wesen } = useBestiariumStore()
const { uniqueValues } = useArrayFunctions()
const { exportToCsv } = useCsvExport()
const { vorkommenToString } = useWesen()
const { sortableHeader, multiSelectableHeader, booleanHeader, numberRangeHeader } = useTableColumnHeader()

const tableData = computed<Wesen[]>(() => wesen.value ?? [])

const kategorien = computed(() => uniqueValues(tableData.value, v => v.kategorie))

const columns = computed<TableColumn<Wesen>[]>(() => [
  {
    id: 'preview',
    cell: ({ row }) =>
      h(UPopover, {}, {
        default: () => h(UButton, { icon: 'i-lucide-search', size: 'xs', color: 'neutral', variant: 'subtle' }),
        content: () => h('div', { class: 'p-4 w-80' }, h(WesenViewComponent, { wesen: row.original }))
      })
  },
  {
    accessorKey: 'name',
    header: sortableHeader<Wesen>('Name'),
    cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/dm/npc/bestiarium/${row.original.name}`, class: 'text-primary hover:underline' }, () => row.original.name)
  },
  { accessorKey: 'kategorie', header: multiSelectableHeader<Wesen>('Gruppe', () => kategorien.value.map(k => ({ label: k, value: k })), { allLabel: 'Alle Gruppen' }), filterFn: 'arrIncludesSome' },
  { accessorKey: 'grad', header: numberRangeHeader<Wesen>('Grad'), filterFn: 'inNumberRange' },
  { accessorKey: 'gf', header: sortableHeader<Wesen>('Gf') },
  {
    id: 'fliegend',
    accessorFn: row => row.fliegend > 0,
    header: booleanHeader<Wesen>('Fliegend'),
    filterFn: 'equals',
    cell: ({ row }) => row.original.fliegend > 0 ? 'Ja' : 'Nein'
  },
  {
    id: 'vorkommen',
    accessorFn: row => row.vorkommen,
    header: sortableHeader<Wesen>('Vorkommen'),
    cell: ({ row }) => vorkommenToString(row.original)
  }
])

const globalFilter = ref('')

const pagination = ref({ pageIndex: 0, pageSize: 10 })

function exportData() {
  const rows = (table.value?.tableApi?.getFilteredRowModel().rows ?? []).map(r => r.original)
  exportToCsv(rows.map(w => ({ ...w, vorkommen: vorkommenToString(w) })), [
    { key: 'name', label: 'Name' },
    { key: 'kategorie', label: 'Gruppe' },
    { key: 'grad', label: 'Grad' },
    { key: 'gf', label: 'Gf' },
    { key: 'vorkommen', label: 'Vorkommen' }
  ], 'bestiarium')
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm text-muted">
        {{ tableData.length }} Wesen
      </p>
      <UInput
        v-model="globalFilter"
        icon="i-lucide-search"
        placeholder="Globale Suche"
        class="max-w-xs"
      />
    </div>

    <UTable
      ref="table"
      v-model:global-filter="globalFilter"
      v-model:pagination="pagination"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      :data="tableData"
      :columns="columns"
      :ui="{ th: 'align-top' }"
    >
      <template #empty>
        <p class="py-6 text-center text-sm text-muted">
          Keine Daten gefunden.
        </p>
      </template>
    </UTable>

    <div class="flex items-center justify-between gap-3 border-t border-default pt-4">
      <div class="flex items-center gap-1.5">
        <UButton
          label="CSV"
          icon="i-lucide-download"
          color="neutral"
          variant="subtle"
          @click="exportData"
        />
        <TableResetFiltersButton :table-api="table?.tableApi" />
      </div>

      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>
