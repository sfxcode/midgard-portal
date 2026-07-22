import type { Abenteurer } from '~/models'

export function useAbenteurerStore() {
  const { findAll } = useMongocampSearch()
  const staleTime: number = 60 * 1000

  const { data: abenteurer, refetch: refetchAbenteurer } = useQuery({
    key: () => ['ms_abenteurer'],
    query: () => findAll('ms_abenteurer').then(res => res as unknown as Abenteurer[]),
    staleTime
  })

  return { abenteurer, refetchAbenteurer }
}
