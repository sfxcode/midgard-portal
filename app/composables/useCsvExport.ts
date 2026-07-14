export function useCsvExport() {
  function escapeCsvValue(value: unknown): string {
    const str = value === null || value === undefined ? '' : String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  function exportToCsv<T>(rows: T[], columns: Array<{ key: keyof T, label: string }>, filename: string) {
    const header = columns.map(column => escapeCsvValue(column.label)).join(',')
    const body = rows.map(row => columns.map(column => escapeCsvValue(row[column.key])).join(',')).join('\n')
    const csv = `${header}\n${body}`

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return { exportToCsv }
}
