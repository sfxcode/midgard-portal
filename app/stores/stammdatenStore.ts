import type { Rasse, SearchResult, Typ } from '~/models'

export function useStammdatenStore() {
  const { findAll } = useMongocampSearch()
  const staleTime: number = 60 * 1000

  const { data: typen, refetch: refetchTypen } = useQuery({
    key: () => ['ms_typen'],
    query: () => findAll('ms_typen', 1, ['name']).then((res: any) => res as Typ[]),
    staleTime,
  })

  function filterTypenByName(name: string): SearchResult[] {
    const result: SearchResult[] = []
    if (typen.value) {
      typen.value.filter((typ: any) => {
        return typ.name.toLowerCase().includes(name.toLowerCase())
      }).forEach((typ: Typ) => result.push({ collection: 'Typ', kategorie: typ.kategorie, name: typ.name }))
    }
    return result
  }

  const { data: rassen, refetch: refetchRassen } = useQuery({
    key: () => ['ms_rassen'],
    query: () => findAll('ms_rassen', 1, ['name']).then((res: any) => res as Rasse[]),
    staleTime,
  })

  const typNamen = computed(() => {
    if (typen.value) {
      return Array.from(new Set(typen.value.map(t => t.name))).sort()
    }
    else {
      return []
    }
  })

  const rasseNamen = computed(() => {
    if (rassen.value) {
      return Array.from(new Set(rassen.value.map(t => t.name))).sort()
    }
    else {
      return []
    }
  })

  return { typen, filterTypenByName, refetchTypen, typNamen, rassen, refetchRassen, rasseNamen }
}
