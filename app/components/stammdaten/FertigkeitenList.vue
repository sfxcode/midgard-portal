<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Fertigkeit, FertigkeitLernen } from '~/models'
import { useFertigkeit } from '~/composables/stamm/useFertigkeit'
import { useFertigkeitenExport } from '~/composables/stamm/useFertigkeitenExport'

const props = defineProps<{
  typName: string
  isElf?: boolean
}>()

const PreviewButton = resolveComponent('PreviewButton')
const FertigkeitViewComponent = resolveComponent('StammdatenFertigkeitView')

const table = useTemplateRef('table')

const { typen } = useStammdatenStore()
const { fertigkeiten, fertigkeitenLerneinheiten, fertigkeitenLerneinheitenByTyp } = useFertigkeitenStore()
const { calculateFertigkeitEpKosten, calculateFertigkeitLernKosten } = useFertigkeit()
const { uniqueValues } = useArrayFunctions()
const { exportToCsv } = useCsvExport()
const { exportFertigkeitenData } = useFertigkeitenExport()
const { sortableHeader, multiSelectableHeader, booleanHeader, searchableHeader, multiSelectFilter } = useTableColumnHeader()

const typ = computed(() => typen.value?.find(t => t.name === props.typName))

const tableData = computed<FertigkeitLernen[]>(() => {
  if (!fertigkeiten.value || !fertigkeitenLerneinheiten.value) {
    return []
  }

  const einheitenMap: Map<string, number> = new Map<string, number>()
  if (typ.value) {
    fertigkeitenLerneinheitenByTyp(typ.value.name).forEach((e) => {
      einheitenMap.set(e.kategorie, e.kosten)
    })
  }

  return fertigkeiten.value.map((fertigkeit: Fertigkeit) => {
    return {
      fertigkeit,
      epKosten: calculateFertigkeitEpKosten(fertigkeit.kategorie, einheitenMap),
      kosten: calculateFertigkeitLernKosten(fertigkeit.kategorie, fertigkeit.lerneinheiten, einheitenMap, !!props.isElf),
      gold: fertigkeit.lerneinheiten * 200,
      name: fertigkeit.name,
      uniqueName: `${fertigkeit.name}/${fertigkeit.kategorie}`,
      kategorie: fertigkeit.kategorie,
      leitwert: fertigkeit.leitwert,
      ungelernt: fertigkeit.ungelernt,
      gelernt: fertigkeit.gelernt,
      schwierigkeit: fertigkeit.schwierigkeit,
      lerneinheiten: fertigkeit.lerneinheiten
    } as FertigkeitLernen
  }).filter(lernen => lernen.kosten > 0 || !typ.value)
})

const kategorien = computed(() => uniqueValues(tableData.value, v => v.kategorie))
const schwierigkeiten = computed(() => uniqueValues(tableData.value, v => v.schwierigkeit))
const lerneinheitenWerte = computed(() => Array.from(new Set(tableData.value.map(v => v.lerneinheiten))).sort((a, b) => a - b))
const kostenWerte = computed(() => Array.from(new Set(tableData.value.map(v => v.kosten))).sort((a, b) => a - b))
const goldWerte = computed(() => Array.from(new Set(tableData.value.map(v => v.gold))).sort((a, b) => a - b))
const epKostenWerte = computed(() => Array.from(new Set(tableData.value.map(v => v.epKosten))).sort((a, b) => a - b))

const columns = computed<TableColumn<FertigkeitLernen>[]>(() => {
  const cols: TableColumn<FertigkeitLernen>[] = [
    {
      id: 'preview',
      cell: ({ row }) =>
        h(PreviewButton, {}, () => h(FertigkeitViewComponent, { fertigkeit: row.original.fertigkeit }))
    },
    {
      accessorKey: 'name',
      header: searchableHeader<FertigkeitLernen>('Name'),
      filterFn: 'includesString',
      cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/manager/stamm/fertigkeiten/${row.original.kategorie}/${row.original.name}`, class: 'text-primary hover:underline' }, () => row.original.name)
    },
    { accessorKey: 'kategorie', header: multiSelectableHeader<FertigkeitLernen>('Kategorie', () => kategorien.value.map(k => ({ label: k, value: k })), { allLabel: 'Alle Kategorien' }), filterFn: multiSelectFilter }
  ]

  if (typ.value) {
    cols.push({
      accessorKey: 'kosten',
      header: multiSelectableHeader<FertigkeitLernen>('Punkte', () => kostenWerte.value.map(v => ({ label: String(v), value: String(v) })), { allLabel: 'Alle Punkte', toValue: Number }),
      filterFn: multiSelectFilter,
      cell: ({ row }) => new Intl.NumberFormat('de-DE').format(row.original.kosten)
    })
    cols.push({
      accessorKey: 'gold',
      header: multiSelectableHeader<FertigkeitLernen>('Gold', () => goldWerte.value.map(v => ({ label: String(v), value: String(v) })), { allLabel: 'Alle Gold', toValue: Number }),
      filterFn: multiSelectFilter,
      cell: ({ row }) => h('span', { class: 'text-primary' }, new Intl.NumberFormat('de-DE').format(row.original.gold))
    })
    cols.push({ accessorKey: 'epKosten', header: multiSelectableHeader<FertigkeitLernen>('EP', () => epKostenWerte.value.map(v => ({ label: String(v), value: String(v) })), { allLabel: 'Alle EP', toValue: Number }), filterFn: multiSelectFilter })
  }

  cols.push({ accessorKey: 'schwierigkeit', header: multiSelectableHeader<FertigkeitLernen>('Schwierigkeit', () => schwierigkeiten.value.map(s => ({ label: s, value: s })), { allLabel: 'Alle Schwierigkeiten' }), filterFn: multiSelectFilter })
  cols.push({ accessorKey: 'lerneinheiten', header: multiSelectableHeader<FertigkeitLernen>('LE', () => lerneinheitenWerte.value.map(v => ({ label: String(v), value: String(v) })), { allLabel: 'Alle LE', toValue: Number }), filterFn: multiSelectFilter })
  cols.push({ accessorKey: 'ungelernt', header: sortableHeader<FertigkeitLernen>('Ungelernt') })
  cols.push({
    id: 'gelerntFlag',
    accessorFn: row => row.gelernt > 0,
    header: booleanHeader<FertigkeitLernen>('Gelernt'),
    filterFn: 'equals',
    cell: ({ row }) => new Intl.NumberFormat('de-DE').format(row.original.gelernt)
  })

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
    { key: 'schwierigkeit', label: 'Schwierigkeit' },
    { key: 'lerneinheiten', label: 'LE' },
    { key: 'ungelernt', label: 'Ungelernt' },
    { key: 'gelernt', label: 'Gelernt' },
    { key: 'epKosten', label: 'EP' },
    { key: 'kosten', label: 'Punkte' },
    { key: 'gold', label: 'Gold' }
  ], 'fertigkeiten')
}

function exportPdf() {
  const rows = (table.value?.tableApi?.getFilteredRowModel().rows ?? []).map(r => r.original)
  const title = typ.value ? `Fertigkeiten Blatt - ${typ.value.name}` : 'Fertigkeiten Blatt'
  exportFertigkeitenData(rows.map(r => r.fertigkeit), title)
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
      data-key="uniqueName"
      :data="tableData"
      :columns="columns"
      :ui="{ th: 'align-top' }"
    >
      <template #empty>
        <p class="py-6 text-center text-sm text-muted">
          Keine Fertigkeiten gefunden.
        </p>
      </template>
    </UTable>

    <TableFooter :table-api="table?.tableApi">
      <p class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredRowModel().rows.length ?? tableData.length }} Fertigkeiten<span v-if="typ"> für Typ {{ typ.name }}</span>
      </p>
    </TableFooter>
  </div>
</template>
