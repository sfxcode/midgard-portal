import type { Beschreibung } from '~/models'

export function useBeschreibung() {
  const { documentApi } = useMongocampApi()
  const { mongoFindRequest } = useMongocampSearch()
  const { ensureMetaData } = useMongocampDocument()

  const beschreibung = ref<Beschreibung>()
  const beschreibungContent = ref('')

  const loadBeschreibung = async (name: string, kategorie: string) => {
    const result = await documentApi.find({
      collectionName: 'ms_beschreibungen',
      mongoFindRequest: mongoFindRequest({ name, kategorie })
    })
    if (result.length > 0) {
      beschreibung.value = result[0] as unknown as Beschreibung
      beschreibungContent.value = beschreibung.value.content
    }
  }

  const saveBeschreibung = async (name: string, kategorie: string) => {
    const content = beschreibungContent.value
    const requestBody = ensureMetaData({ name, kategorie, content, metaData: beschreibung.value?.metaData }) as unknown as Record<string, string>

    if (!beschreibung.value?._id) {
      await documentApi.insert({ collectionName: 'ms_beschreibungen', requestBody })
    } else {
      await documentApi.updateDocumentPartial({ collectionName: 'ms_beschreibungen', documentId: beschreibung.value._id, requestBody })
    }
    await loadBeschreibung(name, kategorie)
  }

  return { beschreibung, beschreibungContent, loadBeschreibung, saveBeschreibung }
}
