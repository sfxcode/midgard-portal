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

const UButton = resolveComponent('UButton')
const UPopover = resolveComponent('UPopover')
const FertigkeitViewComponent = resolveComponent('StammdatenFertigkeitView')

const table = useTemplateRef('table')

const { typen } = useStammdatenStore()
const { fertigkeiten, fertigkeitenLerneinheiten, fertigkeitenLerneinheitenByTyp } = useFertigkeitenStore()
const { calculateFertigkeitEpKosten, calculateFertigkeitLernKosten } = useFertigkeit()
const { uniqueValues } = useArrayFunctions()
const { exportToCsv } = useCsvExport()
const { exportFertigkeitenData } = useFertigkeitenExport()
const { sortableHeader } = useSortableColumn()

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

const columns = computed<TableColumn<FertigkeitLernen>[]>(() => {
  const cols: TableColumn<FertigkeitLernen>[] = [
    {
      id: 'preview',
      cell: ({ row }) =>
        h(UPopover, {}, {
          default: () => h(UButton, { icon: 'i-lucide-search', size: 'xs', color: 'neutral', variant: 'subtle' }),
          content: () => h('div', { class: 'p-4 w-80' }, h(FertigkeitViewComponent, { fertigkeit: row.original.fertigkeit }))
        })
    },
    {
      accessorKey: 'name',
      header: sortableHeader<FertigkeitLernen>('Name'),
      cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/stamm/fertigkeiten/${row.original.kategorie}/${row.original.name}`, class: 'text-primary hover:underline' }, () => row.original.name)
    }
  ]

  if (typ.value) {
    cols.push({
      accessorKey: 'kosten',
      header: sortableHeader<FertigkeitLernen>('Punkte'),
      cell: ({ row }) => new Intl.NumberFormat('de-DE').format(row.original.kosten)
    })
    cols.push({
      accessorKey: 'gold',
      header: sortableHeader<FertigkeitLernen>('Gold'),
      cell: ({ row }) => h('span', { class: 'text-primary' }, new Intl.NumberFormat('de-DE').format(row.original.gold))
    })
    cols.push({ accessorKey: 'epKosten', header: sortableHeader<FertigkeitLernen>('EP') })
  }

  cols.push({ accessorKey: 'kategorie', header: sortableHeader<FertigkeitLernen>('Kategorie') })
  cols.push({ accessorKey: 'schwierigkeit', header: sortableHeader<FertigkeitLernen>('Schwierigkeit') })
  cols.push({ accessorKey: 'lerneinheiten', header: sortableHeader<FertigkeitLernen>('LE') })
  cols.push({ accessorKey: 'ungelernt', header: sortableHeader<FertigkeitLernen>('Ungelernt') })
  cols.push({ accessorKey: 'gelernt', header: sortableHeader<FertigkeitLernen>('Gelernt') })

  return cols
})

const globalFilter = ref('')
const kategorieFilter = ref('all')
const schwierigkeitFilter = ref('all')

function applyFilter(columnId: string, value: string) {
  const column = table.value?.tableApi?.getColumn(columnId)
  if (!column) return
  column.setFilterValue(value === 'all' ? undefined : value)
}

watch(kategorieFilter, v => applyFilter('kategorie', v))
watch(schwierigkeitFilter, v => applyFilter('schwierigkeit', v))

const pagination = ref({ pageIndex: 0, pageSize: 10 })

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
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm text-muted">
        {{ tableData.length }} Fertigkeiten<span v-if="typ"> für Typ {{ typ.name }}</span>
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
      <USelect v-model="schwierigkeitFilter" :items="[{ label: 'Alle Schwierigkeiten', value: 'all' }, ...schwierigkeiten.map(s => ({ label: s, value: s }))]" class="min-w-40" />
    </div>

    <UTable
      ref="table"
      v-model:global-filter="globalFilter"
      v-model:pagination="pagination"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      data-key="uniqueName"
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
