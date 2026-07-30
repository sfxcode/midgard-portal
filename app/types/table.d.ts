import '@tanstack/table-core'

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    // Hide this column below the given breakpoint via useResponsiveColumnVisibility(); unset means always visible.
    minBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  }
}
