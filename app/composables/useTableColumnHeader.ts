import type { Column, Row } from '@tanstack/table-core'
import { UButton, UInput, USelect, USelectMenu } from '#components'
import { h, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

export interface SelectableHeaderItem {
  label: string
  value: string
}

export interface SelectableHeaderOptions {
  allLabel?: string
  toValue?: (value: string) => unknown
  onFilterChange?: (value: unknown | undefined) => void
}

export interface SearchableHeaderOptions {
  placeholder?: string
  debounce?: number
  onFilterChange?: (value: string) => void
}

export interface BooleanHeaderOptions {
  allLabel?: string
  yesLabel?: string
  noLabel?: string
  onFilterChange?: (value: boolean | undefined) => void
}

// `multiSelectableHeader` lets a user pick several values to filter a column
// whose row values are scalars (a single kategorie/stufe/etc per row), not
// arrays. TanStack's built-in 'arrIncludesSome' checks row.getValue(id)?.includes(val)
// — the wrong direction for that shape, and it throws outright for numbers
// (Number.prototype has no .includes). This checks the other way round:
// is the row's scalar value one of the selected filter values.
export function multiSelectFilter<T>(row: Row<T>, columnId: string, filterValue: unknown[]): boolean {
  return filterValue.includes(row.getValue(columnId))
}

export function useTableColumnHeader() {
  function sortToggle<T>(column: Column<T, unknown>, label: string) {
    const isSorted = column.getIsSorted()
    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      size: 'xs',
      label,
      icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
      class: '-mx-2',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
    })
  }

  // `spacer` reserves the filter row's height so headers line up in tables that have filters;
  // pass `{ spacer: false }` for tables without any filter
  function sortableHeader<T>(label: string, options?: { spacer?: boolean }) {
    return ({ column }: { column: Column<T, unknown> }) => h('div', { class: 'flex flex-col gap-1' }, [sortToggle(column, label), ...(options?.spacer === false ? [] : [h('div', { class: 'h-6' })])])
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
          'onUpdate:modelValue': (value: string) => {
            const newValue = value === 'all' ? undefined : toValue(value)
            if (options?.onFilterChange) {
              options.onFilterChange(newValue)
            } else {
              column.setFilterValue(newValue)
            }
          },
          'items': [{ label: allLabel, value: 'all' }, ...items()],
          'size': 'xs',
          'class': 'flex-1 min-w-0 print:hidden'
        })
      ])
    }
  }

  function multiSelectableHeader<T>(label: string, items: () => SelectableHeaderItem[], options?: SelectableHeaderOptions) {
    const allLabel = options?.allLabel ?? 'Alle'
    const toValue = options?.toValue ?? ((value: string) => value)

    return ({ column }: { column: Column<T, unknown> }) => {
      const filterValue = column.getFilterValue() as unknown[] | undefined
      const availableItems = items()
      // modelValue must stay in the same (raw string) domain as `items`' own
      // value field so USelectMenu can match its selection against them —
      // the stored filter value has already gone through `toValue` (e.g.
      // Number), so feeding it back directly breaks toggle/dedup and lets
      // the same item be "selected" again as a duplicate.
      const selectedValues = (filterValue ?? [])
        .map(fv => availableItems.find(item => toValue(item.value) === fv)?.value)
        .filter((v): v is string => v !== undefined)

      return h('div', { class: 'flex flex-col gap-1' }, [
        sortToggle(column, label),
        h(USelectMenu, {
          'modelValue': selectedValues,
          'onUpdate:modelValue': (value: string[]) => {
            const newValue = value.length === 0 ? undefined : value.map(toValue)
            if (options?.onFilterChange) {
              options.onFilterChange(newValue)
            } else {
              column.setFilterValue(newValue)
            }
          },
          'items': availableItems,
          'valueKey': 'value',
          'multiple': true,
          'placeholder': allLabel,
          'size': 'xs',
          'class': 'flex-1 min-w-0 print:hidden',
          'onClick': (event: Event) => event.stopPropagation()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
      ])
    }
  }

  function booleanHeader<T>(label: string, options?: BooleanHeaderOptions) {
    const allLabel = options?.allLabel ?? 'Alle'
    const yesLabel = options?.yesLabel ?? 'Ja'
    const noLabel = options?.noLabel ?? 'Nein'

    return ({ column }: { column: Column<T, unknown> }) => {
      const filterValue = column.getFilterValue()
      const modelValue = filterValue === undefined ? 'all' : String(filterValue)
      return h('div', { class: 'flex flex-col gap-1' }, [
        sortToggle(column, label),
        h(USelect, {
          'modelValue': modelValue,
          'onUpdate:modelValue': (value: string) => {
            const newValue = value === 'all' ? undefined : value === 'true'
            if (options?.onFilterChange) {
              options.onFilterChange(newValue)
            } else {
              column.setFilterValue(newValue)
            }
          },
          'items': [
            { label: allLabel, value: 'all' },
            { label: yesLabel, value: 'true' },
            { label: noLabel, value: 'false' }
          ],
          'size': 'xs',
          'class': 'flex-1 min-w-0 print:hidden',
          'onClick': (event: Event) => event.stopPropagation()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
      ])
    }
  }

  function searchableHeader<T>(label: string, options?: SearchableHeaderOptions) {
    const localValue = ref('')
    let lastColumnValue: string | undefined

    const applyFilter = useDebounceFn((column: Column<T, unknown>, value: string) => {
      // Use server-side callback if provided, otherwise use client-side filtering
      if (options?.onFilterChange) {
        options.onFilterChange(value)
      } else {
        column.setFilterValue(value === '' ? undefined : value)
      }
    }, options?.debounce ?? 300)

    return ({ column }: { column: Column<T, unknown> }) => {
      const filterValue = column.getFilterValue() as string | undefined

      // Sync local value when the column filter changes externally (e.g. reset button)
      if (filterValue !== lastColumnValue) {
        localValue.value = filterValue ?? ''
        lastColumnValue = filterValue
      }

      return h('div', { class: 'flex flex-col gap-1' }, [
        sortToggle(column, label),
        h(UInput, {
          'modelValue': localValue.value,
          'onUpdate:modelValue': (value: string) => {
            localValue.value = value
            applyFilter(column, value)
          },
          'size': 'xs',
          'placeholder': options?.placeholder ?? label,
          'class': 'flex-1 min-w-0 print:hidden',
          'onClick': (event: Event) => event.stopPropagation()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
      ])
    }
  }

  return { sortableHeader, selectableHeader, multiSelectableHeader, booleanHeader, searchableHeader, multiSelectFilter }
}
