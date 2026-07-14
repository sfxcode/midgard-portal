export function useArrayFunctions() {
  function uniqueValues<E>(data: E[] | undefined, f: (current: E) => string): string[] {
    if (!data || !Array.isArray(data)) {
      return []
    }
    const allValues = data.map(f).filter(value => !!value)
    return Array.from(new Set(allValues)).sort()
  }

  return { uniqueValues }
}
