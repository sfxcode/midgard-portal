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
const { sortableHeader, filterableHeader } = useSortableColumn()

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
      header: sortableHeader<ZauberLernen>('Name'),
      cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `/secured/manager/stamm/zauber/${row.original.name}`, class: 'text-primary hover:underline' }, () => row.original.name)
    }
  ]

  if (typ.value) {
    cols.push({
      accessorKey: 'kosten',
      header: sortableHeader<ZauberLernen>('Punkte'),
      cell: ({ row }) => new Intl.NumberFormat('de-DE').format(row.original.kosten)
    })
    cols.push({
      accessorKey: 'gold',
      header: sortableHeader<ZauberLernen>('Gold'),
      cell: ({ row }) => h('span', { class: 'text-primary' }, new Intl.NumberFormat('de-DE').format(row.original.gold))
    })
  }

  cols.push({
    accessorKey: 'stufe',
    header: filterableHeader<ZauberLernen>('Stufe', () => stufen.map(s => ({ label: s, value: s })), { allLabel: 'Alle Stufen', toValue: Number }),
    filterFn: 'equals'
  })

  if (typ.value) {
    cols.push({ accessorKey: 'epKosten', header: sortableHeader<ZauberLernen>('EP') })
  }

  cols.push({ accessorKey: 'zauberdauer', header: filterableHeader<ZauberLernen>('Dauer', () => zauberdauern.value.map(z => ({ label: z, value: z })), { allLabel: 'Alle Dauern' }), filterFn: 'equals' })
  cols.push({ accessorKey: 'kategorie', header: filterableHeader<ZauberLernen>('Kategorie', () => kategorien.value.map(k => ({ label: k, value: k })), { allLabel: 'Alle Kategorien' }), filterFn: 'equals' })
  cols.push({ accessorKey: 'prozess', header: filterableHeader<ZauberLernen>('Prozess', () => prozesse.value.map(p => ({ label: p, value: p })), { allLabel: 'Alle Prozesse' }), filterFn: 'equals' })

  if (!typ.value) {
    cols.push({ accessorKey: 'art', header: filterableHeader<ZauberLernen>('Art', () => arten.value.map(a => ({ label: a, value: a })), { allLabel: 'Alle Arten' }), filterFn: 'equals' })
    cols.push({ accessorKey: 'ap', header: sortableHeader<ZauberLernen>('AP') })
  }

  return cols
})

const globalFilter = ref('')

const pagination = ref({ pageIndex: 0, pageSize: 10 })

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
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm text-muted">
        {{ tableData.length }} Zauber<span v-if="typ"> für Typ {{ typ.name }}</span>
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
