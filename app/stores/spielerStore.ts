import { useSpieler } from '~/composables/spieler/useSpieler'
import type { Spieler } from '~/models'

export function useSpielerStore() {
  const { findAll } = useMongocampSearch()
  const { ensureSpielerForLogin } = useSpieler()
  const mongocampStorage = useMongocampStorage()
  const staleTime: number = 60 * 1000

  const { data: spieler, refetch: refetchSpieler } = useQuery({
    key: () => ['ms_spieler'],
    query: () => findAll('ms_spieler').then(res => res as unknown as Spieler[]),
    staleTime
  })

  const login = computed(() => mongocampStorage.value.profile.user)

  const { data: aktuellerSpieler, refetch: refetchAktuellerSpieler } = useQuery({
    key: () => ['ms_spieler', 'aktuell', login.value],
    query: () => login.value ? ensureSpielerForLogin(login.value) : Promise.resolve(undefined),
    staleTime
  })

  return { spieler, refetchSpieler, login, aktuellerSpieler, refetchAktuellerSpieler }
}
