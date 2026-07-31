<script setup lang="ts">
import type { Table } from '@tanstack/table-core'

const props = withDefaults(defineProps<{
  // Table<T> is invariant in T, so callers with a concrete row type
  // (Table<Wesen>, Table<Abenteurer>, ...) can't structurally widen to
  // Table<unknown>. This component only reads pagination/filter state,
  // neither of which depends on the row type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableApi?: Table<any> | null
  resettable?: boolean
}>(), {
  resettable: true
})

// The table's last row already sits flush against the footer without its own
// border (see `tbody: '[&>tr]:last:[&>td]:border-b-0'` in app.config.ts), so a
// border-t here is only needed to separate the footer from the empty-state
// message — with real rows it would just double up the visual line.
const hasRows = computed(() => (props.tableApi?.getFilteredRowModel().rows.length ?? 0) > 0)
</script>

<template>
  <div class="flex items-center gap-3 pt-4" :class="{ 'border-t border-default': !hasRows }">
    <div class="flex flex-1 items-center gap-1.5">
      <slot />
    </div>

    <UPagination
      :default-page="(tableApi?.getState().pagination.pageIndex || 0) + 1"
      :items-per-page="tableApi?.getState().pagination.pageSize"
      :total="tableApi?.getFilteredRowModel().rows.length"
      @update:page="(p: number) => tableApi?.setPageIndex(p - 1)"
    />

    <div class="flex flex-1 items-center justify-end gap-1.5">
      <TableResetFiltersButton v-if="resettable" :table-api="tableApi" />
    </div>
  </div>
</template>
