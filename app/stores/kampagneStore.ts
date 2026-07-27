import { useKampagne } from '~/composables/spieler/useKampagne'
import type { Kampagne } from '~/models'

export function useKampagneStore() {
  const { findAll } = useMongocampSearch()
  const { findKampagnenBySpielleiter, findKampagnenBySpieler } = useKampagne()
  const mongocampStorage = useMongocampStorage()
  const staleTime: number = 60 * 1000

  const { data: kampagnen, refetch: refetchKampagnen } = useQuery({
    key: () => ['ms_kampagnen'],
    query: () => findAll('ms_kampagnen').then(res => res as unknown as Kampagne[]),
    staleTime
  })

  const login = computed(() => mongocampStorage.value.profile.user)

  const { data: eigeneKampagnenAlsSpielleiter, refetch: refetchEigeneKampagnenAlsSpielleiter } = useQuery({
    key: () => ['ms_kampagnen', 'spielleiter', login.value],
    query: () => login.value ? findKampagnenBySpielleiter(login.value) : Promise.resolve([]),
    staleTime
  })

  const { data: eigeneKampagnenAlsSpieler, refetch: refetchEigeneKampagnenAlsSpieler } = useQuery({
    key: () => ['ms_kampagnen', 'spieler', login.value],
    query: () => login.value ? findKampagnenBySpieler(login.value) : Promise.resolve([]),
    staleTime
  })

  return {
    kampagnen,
    refetchKampagnen,
    eigeneKampagnenAlsSpielleiter,
    refetchEigeneKampagnenAlsSpielleiter,
    eigeneKampagnenAlsSpieler,
    refetchEigeneKampagnenAlsSpieler
  }
}
