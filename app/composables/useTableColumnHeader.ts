import type { Column } from '@tanstack/table-core'
import { UButton, UInput, USelect } from '#components'

export interface SelectableHeaderItem {
  label: string
  value: string
}

export interface SelectableHeaderOptions {
  allLabel?: string
  toValue?: (value: string) => unknown
}

export interface SearchableHeaderOptions {
  placeholder?: string
}

export function useTableColumnHeader() {
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

  function selectableHeader<T>(label: string, items: () => SelectableHeaderItem[], options?: SelectableHeaderOptions) {
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

  function searchableHeader<T>(label: string, options?: SearchableHeaderOptions) {
    return ({ column }: { column: Column<T, unknown> }) => {
      const filterValue = column.getFilterValue()
      return h('div', { class: 'flex flex-col gap-1' }, [
        sortToggle(column, label),
        h(UInput, {
          'modelValue': (filterValue as string) ?? '',
          'onUpdate:modelValue': (value: string) => column.setFilterValue(value === '' ? undefined : value),
          'size': 'xs',
          'placeholder': options?.placeholder ?? label,
          'class': 'w-full',
          'onClick': (event: Event) => event.stopPropagation()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
      ])
    }
  }

  return { sortableHeader, selectableHeader, searchableHeader }
}
