import type { Column } from '@tanstack/table-core'

export function useSortableColumn() {
  const UButton = resolveComponent('UButton')

  function sortableHeader<T>(label: string) {
    return ({ column }: { column: Column<T, unknown> }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label,
        icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  }

  return { sortableHeader }
}
