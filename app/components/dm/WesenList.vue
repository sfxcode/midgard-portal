<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Wesen } from '~/models'
import { useWesen } from '~/composables/dm/useWesen'
import { useWesenGenerator } from '~/composables/dm/useWesenGenerator'

const UButton = resolveComponent('UButton')
const UTooltip = resolveComponent('UTooltip')
const PreviewButton = resolveComponent('PreviewButton')
const WesenViewComponent = resolveComponent('DmWesenView')

const table = useTemplateRef('table')

const { wesen } = useBestiariumStore()
const { uniqueValues } = useArrayFunctions()
const { exportToCsv } = useCsvExport()
const { vorkommenToString } = useWesen()
const { exportWesen } = useWesenGenerator()
const { sortableHeader, multiSelectableHeader, booleanHeader, multiSelectFilter } = useTableColumnHeader()

const tableData = computed<Wesen[]>(() => wesen.value ?? [])

const kategorien = computed(() => uniqueValues(tableData.value, v => v.kategorie))
const gradWerte = computed(() => Array.from(new Set(tableData.value.map(v => v.grad))).sort((a, b) => a - b))

function generateWesenFromRow(row: Wesen) {
  exportWesen({ wesen: row.name, anzahl: 5, anzahlErfahren: 2, anzahlSelten: 1, anzahlLegendaer: 0, bestOf: 2 })
}

const columns = computed<TableColumn<Wesen>[]>(() => withResponsiveBreakpoints([
  {
    id: 'preview',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-1' }, [
        h(PreviewButton, {}, () => h(WesenViewComponent, { wesen: row.original })),
        h(UTooltip, { text: 'Wesen-Bogen als PDF erzeugen' }, () =>
          h(UButton, {
            icon: 'i-lucide-dices',
            size: 'sm',
            color: 'neutral',
            variant: 'subtle',
            ariaLabel: 'Wesen-Bogen als PDF erzeugen',
            onClick: () => generateWesenFromRow(row.original)
          }))
      ])
  },
  {
    accessorKey: 'name',
    header: sortableHeader<Wesen>('Name'),
    cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/dm/npc/bestiarium/${row.original.name}`, class: 'text-primary hover:underline' }, () => row.original.name)
  },
  { accessorKey: 'kategorie', header: multiSelectableHeader<Wesen>('Gruppe', () => kategorien.value.map(k => ({ label: k, value: k })), { allLabel: 'Alle Gruppen' }), filterFn: multiSelectFilter },
  { accessorKey: 'grad', header: multiSelectableHeader<Wesen>('Grad', () => gradWerte.value.map(v => ({ label: String(v), value: String(v) })), { allLabel: 'Alle Grade', toValue: Number }), filterFn: multiSelectFilter },
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
    cell: ({ row }) => {
      const text = vorkommenToString(row.original)
      return h('span', { class: 'line-clamp-2 whitespace-normal', title: text }, text)
    }
  }
]))

const { columnVisibility } = useResponsiveColumnVisibility(columns)

const globalFilter = defineModel<string>('globalFilter', { default: '' })

const pagination = ref({ pageIndex: 0, pageSize: 10 })

defineExpose({ exportData })

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
    <UTable
      ref="table"
      v-model:global-filter="globalFilter"
      v-model:pagination="pagination"
      class="max-sm:hidden"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      :column-visibility="columnVisibility"
      :data="tableData"
      :columns="columns"
      :ui="{ th: 'align-top' }"
    >
      <template #empty>
        <p class="py-6 text-center text-sm text-muted">
          Keine Wesen gefunden.
        </p>
      </template>
    </UTable>

    <RowCards
      class="sm:hidden"
      :table-api="table?.tableApi"
      :fields="[
        { key: 'kategorie', label: 'Gruppe' },
        { key: 'grad', label: 'Grad' },
        { key: 'gf', label: 'Gf' },
        { key: 'fliegend', label: 'Fliegend', format: v => v ? 'Ja' : 'Nein' },
        { key: 'vorkommen', label: 'Vorkommen' }
      ]"
    />

    <TableFooter :table-api="table?.tableApi">
      <p class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredRowModel().rows.length ?? tableData.length }} Wesen
      </p>
    </TableFooter>
  </div>
</template>
