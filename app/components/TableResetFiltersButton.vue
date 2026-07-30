<script setup lang="ts">
import type { Table } from '@tanstack/table-core'

const props = defineProps<{
  // Table<T> is invariant in T (accessorFn/Column positions), so callers with a
  // concrete row type (Table<Wesen>, Table<Abenteurer>, ...) can't structurally
  // widen to Table<unknown>. This component only calls getState()/resetColumnFilters(),
  // neither of which depends on the row type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableApi?: Table<any> | null
}>()

function hasActiveFilters() {
  return (props.tableApi?.getState().columnFilters.length ?? 0) > 0
}

function resetFilters() {
  props.tableApi?.resetColumnFilters()
}
</script>

<template>
  <UButton
    label="Filter zurücksetzen"
    icon="i-lucide-filter-x"
    color="neutral"
    variant="subtle"
    :disabled="!hasActiveFilters()"
    @click="resetFilters"
  />
</template>
