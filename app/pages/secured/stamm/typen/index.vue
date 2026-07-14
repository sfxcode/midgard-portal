<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Typ } from '~/models'
import { useTypenExport } from '~/composables/stamm/useTypenExport'

const table = useTemplateRef('table')

const { typen } = useStammdatenStore()
const { uniqueValues } = useArrayFunctions()
const { exportToCsv } = useCsvExport()
const { exportTypenData } = useTypenExport()
const { sortableHeader } = useSortableColumn()

const kategorien = computed(() => uniqueValues(typen.value, v => v.kategorie))

const columns: TableColumn<Typ>[] = [
  {
    accessorKey: 'name',
    header: sortableHeader<Typ>('Name'),
    cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/stamm/typen/${row.original.name}`, class: 'text-primary hover:underline' }, () => row.original.name)
  },
  { accessorKey: 'nameKurz', header: sortableHeader<Typ>('Bez.') },
  { accessorKey: 'kategorie', header: sortableHeader<Typ>('Kategorie') },
  { accessorKey: 'buch', header: sortableHeader<Typ>('Buch') }
]

const globalFilter = ref('')
const kategorieFilter = ref('all')

watch(kategorieFilter, (value) => {
  const column = table.value?.tableApi?.getColumn('kategorie')
  if (!column) return
  column.setFilterValue(value === 'all' ? undefined : value)
})

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
  { label: 'Stammdaten', icon: 'i-lucide-database', to: '/secured/stamm' },
  { label: 'Typen' }
]

useSeoMeta({
  title: 'Typen'
})
</script>

<template>
  <UDashboardPanel id="stamm-typen">
    <template #header>
      <UDashboardNavbar title="Typen">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm text-muted">
            {{ typen?.length ?? 0 }} Typen
          </p>
          <UInput
            v-model="globalFilter"
            icon="i-lucide-search"
            placeholder="Globale Suche"
            class="max-w-xs"
          />
        </div>

        <div class="flex flex-wrap items-center gap-1.5">
          <USelect v-model="kategorieFilter" :items="[{ label: 'Alle Kategorien', value: 'all' }, ...kategorien.map(k => ({ label: k, value: k }))]" class="min-w-36" />
        </div>

        <UTable
          ref="table"
          v-model:global-filter="globalFilter"
          v-model:pagination="pagination"
          :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
          :data="typen"
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
          <div class="flex items-center gap-1.5">
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
  </UDashboardPanel>
</template>
