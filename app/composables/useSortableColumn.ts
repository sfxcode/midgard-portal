import type { Column } from '@tanstack/table-core'
import { UButton, USelect } from '#components'

export interface FilterableHeaderItem {
  label: string
  value: string
}

export interface FilterableHeaderOptions {
  allLabel?: string
  toValue?: (value: string) => unknown
}

export function useSortableColumn() {
  function sortToggle<T>(column: Column<T, unknown>, label: string) {
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

  function sortableHeader<T>(label: string) {
    return ({ column }: { column: Column<T, unknown> }) => sortToggle(column, label)
  }

  function filterableHeader<T>(label: string, items: () => FilterableHeaderItem[], options?: FilterableHeaderOptions) {
    const allLabel = options?.allLabel ?? 'Alle'
    const toValue = options?.toValue ?? ((value: string) => value)

    return ({ column }: { column: Column<T, unknown> }) => {
      const filterValue = column.getFilterValue()
      return h('div', { class: 'flex flex-col gap-1' }, [
        sortToggle(column, label),
        h(USelect, {
          'modelValue': filterValue === undefined ? 'all' : String(filterValue),
          'onUpdate:modelValue': (value: string) => column.setFilterValue(value === 'all' ? undefined : toValue(value)),
          'items': [{ label: allLabel, value: 'all' }, ...items()],
          'size': 'xs',
          'class': 'w-full'
        })
      ])
    }
  }

  return { sortableHeader, filterableHeader }
}
