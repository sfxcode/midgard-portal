<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Spielergruppe } from '~/models'

const { spielergruppen } = useSpielergruppenStore()
const { sortableHeader } = useTableColumnHeader()

const table = useTemplateRef('table')

const tableData = computed<Spielergruppe[]>(() => spielergruppen.value ?? [])

const columns: TableColumn<Spielergruppe>[] = [
  {
    accessorKey: 'name',
    header: sortableHeader<Spielergruppe>('Name'),
    cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/manager/spielergruppen/${row.original._id}`, class: 'text-primary hover:underline' }, () => row.original.name)
  },
  {
    id: 'mitgliederAnzahl',
    header: 'Mitglieder',
    cell: ({ row }) => row.original.mitglieder.length
  }
]

const globalFilter = ref('')
const pagination = ref({ pageIndex: 0, pageSize: 10 })
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm text-muted">
        {{ tableData.length }} Spielergruppen
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
    >
      <template #empty>
        <p class="py-6 text-center text-sm text-muted">
          Keine Daten gefunden.
        </p>
      </template>
    </UTable>

    <div class="flex items-center justify-end gap-3 border-t border-default pt-4">
      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>
