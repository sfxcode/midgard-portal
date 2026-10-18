<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Abenteurer } from '~/models'

const { abenteurer } = useAbenteurerStore()
const { exportToCsv } = useCsvExport()
const { uniqueValues } = useArrayFunctions()
const { sortableHeader, multiSelectableHeader, searchableHeader, multiSelectFilter } = useTableColumnHeader()

const table = useTemplateRef('table')

const tableData = computed<Abenteurer[]>(() => abenteurer.value ?? [])

const spielerNamen = computed(() => uniqueValues(tableData.value, v => v.spieler))
const typen = computed(() => uniqueValues(tableData.value, v => v.typ))

const columns = computed<TableColumn<Abenteurer>[]>(() => withResponsiveBreakpoints([
  {
    accessorKey: 'name',
    header: searchableHeader<Abenteurer>('Name'),
    filterFn: 'includesString',
    cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/spieler/abenteurer/${row.original._id}`, class: 'text-primary hover:underline' }, () => row.original.name)
  },
  { accessorKey: 'spieler', header: multiSelectableHeader<Abenteurer>('Spieler', () => spielerNamen.value.map(s => ({ label: s, value: s })), { allLabel: 'Alle Spieler' }), filterFn: multiSelectFilter },
  { accessorKey: 'typ', header: multiSelectableHeader<Abenteurer>('Typ', () => typen.value.map(t => ({ label: t, value: t })), { allLabel: 'Alle Typen' }), filterFn: multiSelectFilter },
  { accessorKey: 'grad', header: sortableHeader<Abenteurer>('Grad') }
]))

const { columnVisibility } = useResponsiveColumnVisibility(columns)

const pagination = ref({ pageIndex: 0, pageSize: 10 })

defineExpose({ exportData })

function exportData() {
  const rows = (table.value?.tableApi?.getFilteredRowModel().rows ?? []).map(r => r.original)
  exportToCsv(rows, [
    { key: 'name', label: 'Name' },
    { key: 'spieler', label: 'Spieler' },
    { key: 'typ', label: 'Typ' },
    { key: 'grad', label: 'Grad' }
  ], 'abenteurer')
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <UTable
      ref="table"
      v-model:pagination="pagination"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      :column-visibility="columnVisibility"
      :data="tableData"
      :columns="columns"
      :ui="{ th: 'align-top' }"
    >
      <template #empty>
        <p class="py-6 text-center text-sm text-muted">
          Keine Abenteurer gefunden.
        </p>
      </template>
    </UTable>

    <TableFooter :table-api="table?.tableApi">
      <p class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredRowModel().rows.length ?? tableData.length }} Abenteurer
      </p>
    </TableFooter>
  </div>
</template>
