<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Abenteurer } from '~/models'

const { abenteurer } = useAbenteurerStore()
const { exportToCsv } = useCsvExport()
const { uniqueValues } = useArrayFunctions()
const { sortableHeader, selectableHeader, searchableHeader } = useTableColumnHeader()

const table = useTemplateRef('table')

const tableData = computed<Abenteurer[]>(() => abenteurer.value ?? [])

const spielerNamen = computed(() => uniqueValues(tableData.value, v => v.spieler))
const typen = computed(() => uniqueValues(tableData.value, v => v.typ))

const columns = computed<TableColumn<Abenteurer>[]>(() => [
  {
    accessorKey: 'name',
    header: searchableHeader<Abenteurer>('Name'),
    filterFn: 'includesString',
    cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/spieler/abenteurer/${row.original._id}`, class: 'text-primary hover:underline' }, () => row.original.name)
  },
  { accessorKey: 'spieler', header: selectableHeader<Abenteurer>('Spieler', () => spielerNamen.value.map(s => ({ label: s, value: s })), { allLabel: 'Alle Spieler' }), filterFn: 'equals' },
  { accessorKey: 'typ', header: selectableHeader<Abenteurer>('Typ', () => typen.value.map(t => ({ label: t, value: t })), { allLabel: 'Alle Typen' }), filterFn: 'equals' },
  { accessorKey: 'grad', header: sortableHeader<Abenteurer>('Grad') }
])

const pagination = ref({ pageIndex: 0, pageSize: 10 })

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
    <p class="text-sm text-muted">
      {{ tableData.length }} Abenteurer
    </p>

    <UTable
      ref="table"
      v-model:pagination="pagination"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      :data="tableData"
      :columns="columns"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-2 align-top first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default'
      }"
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
