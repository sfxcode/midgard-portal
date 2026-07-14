import type { Beschreibung } from '~/models'

export function useBeschreibung() {
  const { documentApi } = useMongocampApi()
  const { mongoFindRequest } = useMongocampSearch()

  const beschreibung = ref<Beschreibung>()

  const loadBeschreibung = async (name: string, kategorie: string) => {
    const result = await documentApi.find({
      collectionName: 'ms_beschreibungen',
      mongoFindRequest: mongoFindRequest({ name, kategorie })
    })
    if (result.length > 0) {
      beschreibung.value = result[0] as unknown as Beschreibung
    }
  }

  return { beschreibung, loadBeschreibung }
}
