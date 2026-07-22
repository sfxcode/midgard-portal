<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Abenteurer } from '~/models'

const { abenteurer } = useAbenteurerStore()
const { exportToCsv } = useCsvExport()
const { sortableHeader } = useSortableColumn()

const table = useTemplateRef('table')

const tableData = computed<Abenteurer[]>(() => abenteurer.value ?? [])

const columns: TableColumn<Abenteurer>[] = [
  {
    accessorKey: 'name',
    header: sortableHeader<Abenteurer>('Name'),
    cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/spieler/abenteurer/${row.original._id}`, class: 'text-primary hover:underline' }, () => row.original.name)
  },
  { accessorKey: 'spieler', header: sortableHeader<Abenteurer>('Spieler') },
  { accessorKey: 'typ', header: sortableHeader<Abenteurer>('Typ') },
  { accessorKey: 'grad', header: sortableHeader<Abenteurer>('Grad') }
]

const globalFilter = ref('')
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
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm text-muted">
        {{ tableData.length }} Abenteurer
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
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
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
      <UButton
        label="CSV"
        icon="i-lucide-download"
        color="neutral"
        variant="subtle"
        @click="exportData"
      />

      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>
