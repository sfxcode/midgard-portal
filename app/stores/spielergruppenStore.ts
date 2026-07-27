import { useSpielergruppe } from '~/composables/spieler/useSpielergruppe'
import type { Spielergruppe } from '~/models'

export function useSpielergruppenStore() {
  const { findAll } = useMongocampSearch()
  const { findSpielergruppenByMitglied } = useSpielergruppe()
  const mongocampStorage = useMongocampStorage()
  const staleTime: number = 60 * 1000

  const { data: spielergruppen, refetch: refetchSpielergruppen } = useQuery({
    key: () => ['ms_spielergruppen'],
    query: () => findAll('ms_spielergruppen').then(res => res as unknown as Spielergruppe[]),
    staleTime
  })

  const login = computed(() => mongocampStorage.value.profile.user)

  const { data: eigeneSpielergruppen, refetch: refetchEigeneSpielergruppen } = useQuery({
    key: () => ['ms_spielergruppen', 'eigene', login.value],
    query: () => login.value ? findSpielergruppenByMitglied(login.value) : Promise.resolve([]),
    staleTime
  })

  return { spielergruppen, refetchSpielergruppen, eigeneSpielergruppen, refetchEigeneSpielergruppen }
}
