export interface DiceHistoryEntry {
  id: number
  expression: string
  total: number
  detail: string
}

const MAX_ENTRIES = 20

// Per-viewer convenience only: the last rolls survive a reload via localStorage
export function useDiceHistory() {
  const history = useLocalStorage<DiceHistoryEntry[]>('midgard-dice-history', [])

  function addEntry(entry: Omit<DiceHistoryEntry, 'id'>) {
    history.value = [{ id: Date.now(), ...entry }, ...history.value].slice(0, MAX_ENTRIES)
  }

  function clearHistory() {
    history.value = []
  }

  return { history, addEntry, clearHistory }
}
