<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Spieler } from '~/models'

const { spieler } = useSpielerStore()
const { sortableHeader } = useTableColumnHeader()

const table = useTemplateRef('table')

const tableData = computed<Spieler[]>(() => spieler.value ?? [])

const columns = computed<TableColumn<Spieler>[]>(() => withResponsiveBreakpoints([
  {
    accessorKey: 'name',
    header: sortableHeader<Spieler>('Name', { spacer: false }),
    cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/manager/spieler/${row.original.login}`, class: 'text-primary hover:underline' }, () => row.original.name)
  },
  { accessorKey: 'login', header: sortableHeader<Spieler>('Login', { spacer: false }) },
  { accessorKey: 'email', header: sortableHeader<Spieler>('E-Mail', { spacer: false }), cell: ({ row }) => row.original.email || '–' }
]))

const { columnVisibility } = useResponsiveColumnVisibility(columns)

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
      :column-visibility="columnVisibility"
      :data="tableData"
      :columns="columns"
    >
      <template #empty>
        <p class="py-6 text-center text-sm text-muted">
          Keine Spieler gefunden.
        </p>
      </template>
    </UTable>

    <TableFooter :table-api="table?.tableApi" :resettable="false">
      <p class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredRowModel().rows.length ?? tableData.length }} Spieler
      </p>
    </TableFooter>
  </div>
</template>
