import type { Fertigkeit, FertigkeitLerneinheit, SearchResult } from '~/models'
import { useArraySorting } from '~/composables/useArraySorting'

export function useFertigkeitenStore() {
  const { findAll } = useMongocampSearch()
  const { sortArray } = useArraySorting()
  const staleTime: number = 60 * 1000

  const { data: fertigkeiten, refetch: refetchFertigkeiten } = useQuery({
    key: () => ['ms_fertigkeiten'],
    query: () => findAll('ms_fertigkeiten').then(res => res as unknown as Fertigkeit[]),
    staleTime
  })

  function filterFertigkeitenByName(name: string): SearchResult[] {
    const result: SearchResult[] = []
    if (fertigkeiten.value) {
      fertigkeiten.value.filter((fertigkeit) => {
        return fertigkeit.name.toLowerCase().includes(name.toLowerCase())
      }).forEach((fertigkeit: Fertigkeit) => result.push({ collection: 'Fertigkeit', kategorie: fertigkeit.kategorie, name: fertigkeit.name }))
    }
    return result
  }

  const fertigkeitenNamen = computed(() => {
    if (fertigkeiten.value) {
      return Array.from(new Set(fertigkeiten.value.map(t => t.name))).sort()
    } else {
      return []
    }
  })

  const { data: fertigkeitenLerneinheiten, refetch: refetchFertigkeitenLerneinheiten } = useQuery({
    key: () => ['ms_fertigkeiten_lerneinheiten'],
    query: () => findAll('ms_fertigkeiten_lerneinheiten').then(res => res as unknown as FertigkeitLerneinheit[]),
    staleTime
  })

  function fertigkeitenLerneinheitenByTyp(typ: string): FertigkeitLerneinheit[] {
    if (!fertigkeitenLerneinheiten.value) {
      return []
    }
    return sortArray(fertigkeitenLerneinheiten.value.filter((le) => {
      return le.typ === typ && le.kosten > 0
    }), 'kategorie')
  }

  return { fertigkeiten, filterFertigkeitenByName, refetchFertigkeiten, fertigkeitenNamen, fertigkeitenLerneinheiten, refetchFertigkeitenLerneinheiten, fertigkeitenLerneinheitenByTyp }
}
