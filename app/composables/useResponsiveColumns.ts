import type { ColumnDef, VisibilityState } from '@tanstack/table-core'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const RESPONSIVE_BREAKPOINT_TIERS = ['sm', 'md', 'lg', 'xl', '2xl'] as const

// Leaves a leading unlabeled `preview` action column (if any) and the first
// two labeled columns after it (e.g. name/kategorie) unset — always visible —
// and assigns every column after that an increasing minBreakpoint tier two
// at a time, in column order, so a wide table degrades gracefully instead of
// all its secondary columns fighting for the same breakpoint.
export function withResponsiveBreakpoints<T>(columns: ColumnDef<T, unknown>[]): ColumnDef<T, unknown>[] {
  let alwaysVisibleRemaining = 2
  let otherIndex = 0
  return columns.map((column) => {
    const key = column.id ?? (column as { accessorKey?: string }).accessorKey
    if (!key || key === 'preview') {
      return column
    }
    if (alwaysVisibleRemaining > 0) {
      alwaysVisibleRemaining--
      return column
    }
    const tier = RESPONSIVE_BREAKPOINT_TIERS[Math.min(Math.floor(otherIndex / 2), RESPONSIVE_BREAKPOINT_TIERS.length - 1)]
    otherIndex++
    return { ...column, meta: { ...column.meta, minBreakpoint: tier } }
  })
}

export function useResponsiveColumnVisibility<T>(columns: Ref<ColumnDef<T, unknown>[]> | ComputedRef<ColumnDef<T, unknown>[]>) {
  const breakpoints = useBreakpoints(breakpointsTailwind)

  const columnVisibility = computed<VisibilityState>(() => {
    const state: VisibilityState = {}
    for (const column of columns.value) {
      const minBreakpoint = column.meta?.minBreakpoint
      const key = column.id ?? (column as { accessorKey?: string }).accessorKey
      if (minBreakpoint && key) {
        state[key] = breakpoints.greaterOrEqual(minBreakpoint).value
      }
    }
    return state
  })

  return { columnVisibility }
}
