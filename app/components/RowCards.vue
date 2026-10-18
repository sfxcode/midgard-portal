<script setup lang="ts" generic="T">
import type { Column, Row, Table } from '@tanstack/table-core'

interface Field {
  key: string
  label: string
  format?: (value: unknown) => string
}

const props = withDefaults(defineProps<{
  tableApi?: Table<T>
  fields: Field[]
  titleKey?: string
}>(), {
  tableApi: undefined,
  titleKey: 'name'
})

const filtersOpen = ref(false)

// Sorting for the card list: the title column plus every listed field whose column can sort
const sortOptions = computed(() => [
  { label: 'Name', value: props.titleKey },
  ...shownFields.value.map(field => ({ label: field.label, value: field.key }))
].filter(option => props.tableApi?.getColumn(option.value)?.getCanSort()))

const sortKey = computed(() => props.tableApi?.getState().sorting[0]?.id)
const sortDesc = computed(() => props.tableApi?.getState().sorting[0]?.desc ?? false)

function setSort(id: string | undefined, desc = sortDesc.value) {
  props.tableApi?.setSorting(id ? [{ id, desc }] : [])
}

// Renders a TanStack cell/header render result (VNode or string) inside the template
const Render = (renderProps: { render: () => unknown }) => renderProps.render() as never

const shownFields = computed(() => props.fields.filter(field => props.tableApi?.getColumn(field.key)))

// Every column with an explicit filter keeps its own header control (select/search + sort toggle),
// including columns the responsive layout hides at this width. TanStack defaults filterFn to 'auto'.
const filterColumns = computed(() => (props.tableApi?.getAllLeafColumns() ?? [])
  .filter(column => column.columnDef.filterFn && column.columnDef.filterFn !== 'auto' && typeof column.columnDef.header === 'function'))

// The project's header builders only use `column` from the context
function renderHeader(column: Column<T, unknown>) {
  return (column.columnDef.header as (ctx: unknown) => unknown)({ column, table: props.tableApi })
}

function renderCell(row: Row<T>, columnId: string) {
  const cell = row.getAllCells().find(c => c.column.id === columnId)
  const render = cell?.column.columnDef.cell
  return cell && typeof render === 'function' ? (render as (ctx: unknown) => unknown)(cell.getContext()) : null
}

function hasCell(row: Row<T>, columnId: string) {
  return row.getAllCells().some(c => c.column.id === columnId)
}

function displayValue(row: Row<T>, field: Field) {
  const value = row.getValue(field.key)
  if (value === null || value === undefined || value === '') {
    return '–'
  }
  return field.format ? field.format(value) : String(value)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div v-if="filterColumns.length || sortOptions.length" class="flex items-center gap-2">
      <UButton
        :label="filtersOpen ? 'Filter ausblenden' : 'Filter & Sortierung'"
        icon="i-lucide-sliders-horizontal"
        color="neutral"
        variant="subtle"
        size="sm"
        @click="filtersOpen = !filtersOpen"
      />
      <UBadge
        v-if="tableApi?.getState().columnFilters.length"
        :label="`${tableApi.getState().columnFilters.length} aktiv`"
        color="primary"
        variant="subtle"
      />
    </div>

    <div v-if="filtersOpen" class="rpg-stat flex flex-col gap-3 p-3">
      <div v-if="sortOptions.length" class="flex items-end gap-2">
        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <span class="rpg-stat-label">Sortieren nach</span>
          <USelect
            :model-value="sortKey ?? undefined"
            :items="sortOptions"
            placeholder="Standard"
            size="sm"
            @update:model-value="(value: string) => setSort(value)"
          />
        </div>
        <UButton
          :icon="sortDesc ? 'i-lucide-arrow-up-z-a' : 'i-lucide-arrow-down-a-z'"
          :aria-label="sortDesc ? 'Absteigend' : 'Aufsteigend'"
          color="neutral"
          variant="subtle"
          size="sm"
          :disabled="!sortKey"
          @click="setSort(sortKey, !sortDesc)"
        />
      </div>

      <div v-for="column in filterColumns" :key="column.id">
        <Render :render="() => renderHeader(column)" />
      </div>
    </div>

    <div
      v-for="row in tableApi?.getRowModel().rows ?? []"
      :key="row.id"
      class="rpg-stat flex flex-col gap-2 p-3"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="font-display text-base min-w-0 break-words">
          <Render :render="() => renderCell(row, titleKey)" />
        </div>
        <div v-if="hasCell(row, 'preview')" class="shrink-0">
          <Render :render="() => renderCell(row, 'preview')" />
        </div>
      </div>

      <dl v-if="shownFields.length" class="grid grid-cols-2 gap-x-3 gap-y-1.5">
        <div v-for="field in shownFields" :key="field.key" class="min-w-0">
          <dt class="rpg-stat-label">
            {{ field.label }}
          </dt>
          <dd class="text-sm text-highlighted line-clamp-2 break-words">
            {{ displayValue(row, field) }}
          </dd>
        </div>
      </dl>
    </div>

    <EmptyState v-if="!(tableApi?.getRowModel().rows.length)" title="Keine Einträge gefunden." />
  </div>
</template>
