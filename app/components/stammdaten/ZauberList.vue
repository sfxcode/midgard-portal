<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { ZauberLernen } from '~/models'
import { useZauber } from '~/composables/stamm/useZauber'
import { useZauberExport } from '~/composables/stamm/useZauberExport'

const props = defineProps<{
  typName: string
  isElf?: boolean
  zauberFilter?: string[]
}>()

const UButton = resolveComponent('UButton')
const UPopover = resolveComponent('UPopover')
const ZauberViewComponent = resolveComponent('StammdatenZauberView')

const table = useTemplateRef('table')

const { typen } = useStammdatenStore()
const { zauber, zauberLerneinheiten, zauberLerneinheitenByTyp } = useZauberStore()
const { zauberLernenByTyp } = useZauber()
const { uniqueValues } = useArrayFunctions()
const { exportToCsv } = useCsvExport()
const { exportZauberData } = useZauberExport()
const { sortableHeader, multiSelectableHeader, searchableHeader, multiSelectFilter } = useTableColumnHeader()

const typ = computed(() => typen.value?.find(t => t.name === props.typName))

const tableData = computed<ZauberLernen[]>(() => {
  if (!zauber.value || !zauberLerneinheiten.value) {
    return []
  }
  const result = zauberLernenByTyp(zauber.value, props.typName, !!props.isElf, zauberLerneinheitenByTyp)
  return props.zauberFilter ? result.filter(z => props.zauberFilter!.includes(z.name)) : result
})

const kategorien = computed(() => uniqueValues(tableData.value, v => v.kategorie))
const prozesse = computed(() => uniqueValues(tableData.value, v => v.prozess))
const arten = computed(() => uniqueValues(tableData.value, v => v.art))
const zauberdauern = computed(() => uniqueValues(tableData.value, v => v.zauberdauer))
const stufen = Array.from({ length: 12 }, (_, i) => String(i + 1))
const kostenWerte = computed(() => Array.from(new Set(tableData.value.map(v => v.kosten))).sort((a, b) => a - b))
const goldWerte = computed(() => Array.from(new Set(tableData.value.map(v => v.gold))).sort((a, b) => a - b))
const epKostenWerte = computed(() => Array.from(new Set(tableData.value.map(v => v.epKosten))).sort((a, b) => a - b))

const columns = computed<TableColumn<ZauberLernen>[]>(() => {
  const cols: TableColumn<ZauberLernen>[] = [
    {
      id: 'preview',
      cell: ({ row }) =>
        h(UPopover, {}, {
          default: () => h(UButton, { icon: 'i-lucide-search', size: 'xs', color: 'neutral', variant: 'subtle' }),
          content: () => h('div', { class: 'p-4 w-80' }, h(ZauberViewComponent, { zauber: row.original.zauber }))
        })
    },
    {
      accessorKey: 'name',
      header: searchableHeader<ZauberLernen>('Name'),
      filterFn: 'includesString',
      cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/manager/stamm/zauber/${row.original.name}`, class: 'text-primary hover:underline' }, () => row.original.name)
    },
    { accessorKey: 'kategorie', header: multiSelectableHeader<ZauberLernen>('Kategorie', () => kategorien.value.map(k => ({ label: k, value: k })), { allLabel: 'Alle Kategorien' }), filterFn: multiSelectFilter }
  ]

  if (typ.value) {
    cols.push({
      accessorKey: 'kosten',
      header: multiSelectableHeader<ZauberLernen>('Punkte', () => kostenWerte.value.map(v => ({ label: String(v), value: String(v) })), { allLabel: 'Alle Punkte', toValue: Number }),
      filterFn: multiSelectFilter,
      cell: ({ row }) => new Intl.NumberFormat('de-DE').format(row.original.kosten)
    })
    cols.push({
      accessorKey: 'gold',
      header: multiSelectableHeader<ZauberLernen>('Gold', () => goldWerte.value.map(v => ({ label: String(v), value: String(v) })), { allLabel: 'Alle Gold', toValue: Number }),
      filterFn: multiSelectFilter,
      cell: ({ row }) => h('span', { class: 'text-primary' }, new Intl.NumberFormat('de-DE').format(row.original.gold))
    })
  }

  cols.push({
    accessorKey: 'stufe',
    header: multiSelectableHeader<ZauberLernen>('Stufe', () => stufen.map(s => ({ label: s, value: s })), { allLabel: 'Alle Stufen', toValue: Number }),
    filterFn: multiSelectFilter
  })

  if (typ.value) {
    cols.push({ accessorKey: 'epKosten', header: multiSelectableHeader<ZauberLernen>('EP', () => epKostenWerte.value.map(v => ({ label: String(v), value: String(v) })), { allLabel: 'Alle EP', toValue: Number }), filterFn: multiSelectFilter })
  }

  cols.push({ accessorKey: 'zauberdauer', header: multiSelectableHeader<ZauberLernen>('Dauer', () => zauberdauern.value.map(z => ({ label: z, value: z })), { allLabel: 'Alle Dauern' }), filterFn: multiSelectFilter })
  cols.push({ accessorKey: 'prozess', header: multiSelectableHeader<ZauberLernen>('Prozess', () => prozesse.value.map(p => ({ label: p, value: p })), { allLabel: 'Alle Prozesse' }), filterFn: multiSelectFilter })

  if (!typ.value) {
    cols.push({ accessorKey: 'art', header: multiSelectableHeader<ZauberLernen>('Art', () => arten.value.map(a => ({ label: a, value: a })), { allLabel: 'Alle Arten' }), filterFn: multiSelectFilter })
    cols.push({ accessorKey: 'ap', header: sortableHeader<ZauberLernen>('AP') })
  }

  return withResponsiveBreakpoints(cols)
})

const { columnVisibility } = useResponsiveColumnVisibility(columns)

const globalFilter = defineModel<string>('globalFilter', { default: '' })

const pagination = ref({ pageIndex: 0, pageSize: 10 })

defineExpose({ exportData, exportPdf })

function exportData() {
  const rows = (table.value?.tableApi?.getFilteredRowModel().rows ?? []).map(r => r.original)
  exportToCsv(rows, [
    { key: 'name', label: 'Name' },
    { key: 'kategorie', label: 'Kategorie' },
    { key: 'prozess', label: 'Prozess' },
    { key: 'art', label: 'Art' },
    { key: 'stufe', label: 'Stufe' },
    { key: 'ap', label: 'AP' },
    { key: 'zauberdauer', label: 'Zauberdauer' },
    { key: 'epKosten', label: 'EP' },
    { key: 'kosten', label: 'Punkte' },
    { key: 'gold', label: 'Gold' }
  ], 'zauber')
}

function exportPdf() {
  const rows = (table.value?.tableApi?.getFilteredRowModel().rows ?? []).map(r => r.original)
  const title = typ.value ? `Zauber Blatt - ${typ.value.name}` : 'Zauber Blatt'
  exportZauberData(rows.map(r => r.name), title)
}
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
      :ui="{ th: 'align-top' }"
    >
      <template #empty>
        <p class="py-6 text-center text-sm text-muted">
          Keine Daten gefunden.
        </p>
      </template>
    </UTable>

    <TableFooter :table-api="table?.tableApi">
      <p class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredRowModel().rows.length ?? tableData.length }} Zauber<span v-if="typ"> für Typ {{ typ.name }}</span>
      </p>
    </TableFooter>
  </div>
</template>
