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
const { sortableHeader } = useSortableColumn()

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
  { accessorKey: 'kategorie', header: sortableHeader<Wesen>('Gruppe') },
  { accessorKey: 'grad', header: sortableHeader<Wesen>('Grad') },
  { accessorKey: 'gf', header: sortableHeader<Wesen>('Gf') },
  {
    id: 'vorkommen',
    accessorFn: row => row.vorkommen,
    header: sortableHeader<Wesen>('Vorkommen'),
    cell: ({ row }) => vorkommenToString(row.original)
  }
])

const globalFilter = ref('')
const kategorieFilter = ref('all')

function applyFilter(columnId: string, value: string) {
  const column = table.value?.tableApi?.getColumn(columnId)
  if (!column) return
  column.setFilterValue(value === 'all' ? undefined : value)
}

watch(kategorieFilter, v => applyFilter('kategorie', v))

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

    <div class="flex flex-wrap items-center gap-1.5">
      <USelect v-model="kategorieFilter" :items="[{ label: 'Alle Gruppen', value: 'all' }, ...kategorien.map(k => ({ label: k, value: k }))]" class="min-w-36" />
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
