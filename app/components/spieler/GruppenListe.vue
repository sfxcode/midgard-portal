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

const globalFilter = defineModel<string>('globalFilter', { default: '' })
const pagination = ref({ pageIndex: 0, pageSize: 10 })
</script>

<template>
  <div class="flex flex-col gap-3">
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

    <TableFooter :table-api="table?.tableApi" :resettable="false">
      <p class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredRowModel().rows.length ?? tableData.length }} Spielergruppen
      </p>
    </TableFooter>
  </div>
</template>
