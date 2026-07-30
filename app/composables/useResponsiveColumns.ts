import type { ColumnDef, VisibilityState } from '@tanstack/table-core'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

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
