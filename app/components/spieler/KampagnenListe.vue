<script setup lang="ts">
import type { PropType } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Kampagne } from '~/models'

const props = defineProps({
  kampagnen: {
    type: Array as PropType<Kampagne[]>,
    default: () => []
  },
  emptyText: {
    type: String,
    default: 'Keine Kampagnen gefunden.'
  },
  basePath: {
    type: String,
    default: '/secured/spieler/kampagnen'
  }
})

const columns: TableColumn<Kampagne>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => h(resolveComponent('NuxtLink'), { to: `${props.basePath}/${row.original._id}`, class: 'text-primary hover:underline' }, () => row.original.name)
  },
  { accessorKey: 'spielleiter', header: 'Spielleiter' },
  {
    id: 'spielerAnzahl',
    header: 'Spieler',
    cell: ({ row }) => row.original.spieler.length
  }
]

const tableData = computed(() => props.kampagnen)
</script>

<template>
  <UTable
    :data="tableData"
    :columns="columns"
  >
    <template #empty>
      <p class="py-6 text-center text-sm text-muted">
        {{ emptyText }}
      </p>
    </template>
  </UTable>
</template>
