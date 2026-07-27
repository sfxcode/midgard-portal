import type { MetaData, Spieler } from '~/models'

export function useSpieler() {
  const { findByField } = useMongocampSearch()
  const { documentApi } = useMongocampApi()
  const { ensureMetaData } = useMongocampDocument()

  function createSpieler(login: string, name: string, email?: string): Spieler {
    return {
      login,
      name,
      email,
      metaData: {} as MetaData
    }
  }

  async function findSpielerByLogin(login: string): Promise<Spieler | undefined> {
    if (!login) {
      return undefined
    }
    const result = await findByField('ms_spieler', 'login', login)
    return result[0] as unknown as Spieler | undefined
  }

  async function saveSpieler(spieler: Spieler): Promise<Spieler> {
    const { _id: documentId, ...rest } = spieler
    const requestBody = ensureMetaData(rest) as unknown as Record<string, string>
    if (!documentId) {
      const result = await documentApi.insert({ collectionName: 'ms_spieler', requestBody })
      return { ...spieler, _id: result.insertedIds?.[0] }
    }
    await documentApi.updateDocumentPartial({ collectionName: 'ms_spieler', documentId, requestBody })
    return spieler
  }

  async function ensureSpielerForLogin(login: string, name?: string): Promise<Spieler | undefined> {
    if (!login) {
      return undefined
    }
    const existing = await findSpielerByLogin(login)
    if (existing) {
      return existing
    }
    return saveSpieler(createSpieler(login, name ?? login))
  }

  async function deleteSpieler(documentId: string): Promise<void> {
    await documentApi._delete({ collectionName: 'ms_spieler', documentId })
  }

  return { createSpieler, findSpielerByLogin, saveSpieler, ensureSpielerForLogin, deleteSpieler }
}
