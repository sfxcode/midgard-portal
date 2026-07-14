import type { SearchResult, Zauber, ZauberLerneinheit } from '~/models'
import { useArraySorting } from '~/composables/useArraySorting'

export function useZauberStore() {
  const { findAll } = useMongocampSearch()
  const { sortArray } = useArraySorting()
  const staleTime: number = 60 * 1000

  const { data: zauber, refetch: refetchZauber } = useQuery({
    key: () => ['ms_zauber'],
    query: () => findAll('ms_zauber').then((res: any) => res as Zauber[]),
    staleTime,
  })

  function filterZauberByName(name: string): SearchResult[] {
    const result: SearchResult[] = []
    if (zauber.value) {
      zauber.value.filter((zauber: any) => {
        return zauber.name.toLowerCase().includes(name.toLowerCase())
      }).forEach((zauber: Zauber) => result.push({ collection: 'Zauber', kategorie: zauber.kategorie, name: zauber.name }))
    }
    return result
  }

  function filterZauberByNames(names: string[]): Zauber[] {
    if (!zauber.value || !names || names.length === 0) {
      return []
    }
    return zauber.value.filter((z: Zauber) => names.includes(z.name))
  }

  const zauberNamen = computed(() => {
    if (zauber.value) {
      return Array.from(new Set(zauber.value.map(t => t.name))).sort()
    }
    else {
      return []
    }
  })

  const { data: zauberLerneinheiten, refetch: refetchZauberLerneinheiten } = useQuery({
    key: () => ['ms_zauber_lerneinheiten'],
    query: () => findAll('ms_zauber_lerneinheiten').then((res: any) => res as ZauberLerneinheit[]),
    staleTime,
  })

  function zauberLerneinheitenByTyp(typ: string): ZauberLerneinheit[] {
    if (!zauberLerneinheiten.value) {
      return []
    }
    return sortArray(zauberLerneinheiten.value.filter((le: any) => {
      return le.typ === typ && le.kosten > 0
    }), 'kategorie')
  }

  return { zauber, refetchZauber, zauberNamen, filterZauberByName, filterZauberByNames, zauberLerneinheiten, refetchZauberLerneinheiten, zauberLerneinheitenByTyp }
}
