import type { Kampagne, MetaData } from '~/models'

export function useKampagne() {
  const { findByField } = useMongocampSearch()
  const { documentApi } = useMongocampApi()
  const { ensureMetaData } = useMongocampDocument()

  function createKampagne(name: string, spielleiter: string, beschreibung?: string): Kampagne {
    return {
      name,
      beschreibung,
      spielleiter,
      spieler: [],
      metaData: {} as MetaData
    }
  }

  async function findKampagnenBySpielleiter(login: string): Promise<Kampagne[]> {
    if (!login) {
      return []
    }
    const result = await findByField('ms_kampagnen', 'spielleiter', login)
    return result as unknown as Kampagne[]
  }

  async function findKampagnenBySpieler(login: string): Promise<Kampagne[]> {
    if (!login) {
      return []
    }
    const result = await findByField('ms_kampagnen', 'spieler', login)
    return result as unknown as Kampagne[]
  }

  async function saveKampagne(kampagne: Kampagne): Promise<Kampagne> {
    const { _id: documentId, ...rest } = kampagne
    const requestBody = ensureMetaData(rest) as unknown as Record<string, string>
    if (!documentId) {
      const result = await documentApi.insert({ collectionName: 'ms_kampagnen', requestBody })
      return { ...kampagne, _id: result.insertedIds?.[0] }
    }
    await documentApi.updateDocumentPartial({ collectionName: 'ms_kampagnen', documentId, requestBody })
    return kampagne
  }

  function addSpieler(kampagne: Kampagne, login: string): Kampagne {
    if (kampagne.spieler.includes(login)) {
      return kampagne
    }
    return { ...kampagne, spieler: [...kampagne.spieler, login] }
  }

  function removeSpieler(kampagne: Kampagne, login: string): Kampagne {
    return { ...kampagne, spieler: kampagne.spieler.filter(spieler => spieler !== login) }
  }

  async function deleteKampagne(documentId: string): Promise<void> {
    await documentApi._delete({ collectionName: 'ms_kampagnen', documentId })
  }

  return { createKampagne, findKampagnenBySpielleiter, findKampagnenBySpieler, saveKampagne, addSpieler, removeSpieler, deleteKampagne }
}
