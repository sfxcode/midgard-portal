import type { Wesen } from '~/models'

export function useBestiariumStore() {
  const { findAll } = useMongocampSearch()
  const staleTime: number = 60 * 1000

  const { data: wesen, refetch: refetchWesen } = useQuery({
    key: () => ['ms_bestiarium'],
    query: () => findAll('ms_bestiarium').then(res => res as unknown as Wesen[]),
    staleTime
  })

  return { wesen, refetchWesen }
}
