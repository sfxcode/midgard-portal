import type { Column } from '@tanstack/table-core'
import { UButton, UInput, UInputNumber, USelect, USelectMenu } from '#components'
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

export interface NumberRangeHeaderOptions {
  min?: number
  max?: number
  step?: number
  minPlaceholder?: string
  maxPlaceholder?: string
  onFilterChange?: (value: [number | undefined, number | undefined] | undefined) => void
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
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    })
  }

  function sortableHeader<T>(label: string) {
    return ({ column }: { column: Column<T, unknown> }) => h('div', { class: 'flex flex-col gap-1' }, [sortToggle(column, label), h('div', { class: 'h-6' })])
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
            }
            else {
              column.setFilterValue(newValue)
            }
          },
          'items': [{ label: allLabel, value: 'all' }, ...items()],
          'size': 'xs',
          'class': 'flex-1 min-w-0',
        }),
      ])
    }
  }

  function multiSelectableHeader<T>(label: string, items: () => SelectableHeaderItem[], options?: SelectableHeaderOptions) {
    const allLabel = options?.allLabel ?? 'Alle'
    const toValue = options?.toValue ?? ((value: string) => value)

    return ({ column }: { column: Column<T, unknown> }) => {
      const filterValue = column.getFilterValue() as string[] | undefined
      return h('div', { class: 'flex flex-col gap-1' }, [
        sortToggle(column, label),
        h(USelectMenu, {
          'modelValue': filterValue ?? [],
          'onUpdate:modelValue': (value: string[]) => {
            const newValue = value.length === 0 ? undefined : value.map(toValue)
            if (options?.onFilterChange) {
              options.onFilterChange(newValue)
            }
            else {
              column.setFilterValue(newValue)
            }
          },
          'items': items(),
          'valueKey': 'value',
          'multiple': true,
          'placeholder': allLabel,
          'size': 'xs',
          'class': 'flex-1 min-w-0',
          'onClick': (event: Event) => event.stopPropagation(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
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
            }
            else {
              column.setFilterValue(newValue)
            }
          },
          'items': [
            { label: allLabel, value: 'all' },
            { label: yesLabel, value: 'true' },
            { label: noLabel, value: 'false' },
          ],
          'size': 'xs',
          'class': 'flex-1 min-w-0',
          'onClick': (event: Event) => event.stopPropagation(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
      ])
    }
  }

  function numberRangeHeader<T>(label: string, options?: NumberRangeHeaderOptions) {
    return ({ column }: { column: Column<T, unknown> }) => {
      const filterValue = column.getFilterValue() as [number | undefined, number | undefined] | undefined
      const min = filterValue?.[0]
      const max = filterValue?.[1]

      const setMin = (value: number | null) => {
        const next = value ?? undefined
        const newValue = next === undefined && max === undefined ? undefined : [next, max]
        if (options?.onFilterChange) {
          options.onFilterChange(newValue as [number | undefined, number | undefined] | undefined)
        }
        else {
          column.setFilterValue(newValue)
        }
      }
      const setMax = (value: number | null) => {
        const next = value ?? undefined
        const newValue = min === undefined && next === undefined ? undefined : [min, next]
        if (options?.onFilterChange) {
          options.onFilterChange(newValue as [number | undefined, number | undefined] | undefined)
        }
        else {
          column.setFilterValue(newValue)
        }
      }

      return h('div', { class: 'flex flex-col gap-1' }, [
        sortToggle(column, label),
        h('div', { class: 'flex items-center gap-1' }, [
          h(UInputNumber, {
            'modelValue': min ?? null,
            'onUpdate:modelValue': setMin,
            'min': options?.min,
            'max': options?.max,
            'step': options?.step,
            'placeholder': options?.minPlaceholder ?? 'Min',
            'size': 'xs',
            'class': 'flex-1 min-w-0',
            'onClick': (event: Event) => event.stopPropagation(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any),
          h(UInputNumber, {
            'modelValue': max ?? null,
            'onUpdate:modelValue': setMax,
            'min': options?.min,
            'max': options?.max,
            'step': options?.step,
            'placeholder': options?.maxPlaceholder ?? 'Max',
            'size': 'xs',
            'class': 'flex-1 min-w-0',
            'onClick': (event: Event) => event.stopPropagation(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any),
        ]),
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
      }
      else {
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
          'class': 'flex-1 min-w-0',
          'onClick': (event: Event) => event.stopPropagation(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
      ])
    }
  }

  return { sortableHeader, selectableHeader, multiSelectableHeader, booleanHeader, numberRangeHeader, searchableHeader }
}
