import type { MetaData, Spielergruppe } from '~/models'

export function useSpielergruppe() {
  const { findByField } = useMongocampSearch()
  const { documentApi } = useMongocampApi()
  const { ensureMetaData } = useMongocampDocument()

  function createSpielergruppe(name: string, mitglieder: string[] = []): Spielergruppe {
    return {
      name,
      mitglieder,
      metaData: {} as MetaData
    }
  }

  async function findSpielergruppenByMitglied(login: string): Promise<Spielergruppe[]> {
    if (!login) {
      return []
    }
    const result = await findByField('ms_spielergruppen', 'mitglieder', login)
    return result as unknown as Spielergruppe[]
  }

  async function saveSpielergruppe(gruppe: Spielergruppe): Promise<Spielergruppe> {
    const { _id: documentId, ...rest } = gruppe
    const requestBody = ensureMetaData(rest) as unknown as Record<string, string>
    if (!documentId) {
      const result = await documentApi.insert({ collectionName: 'ms_spielergruppen', requestBody })
      return { ...gruppe, _id: result.insertedIds?.[0] }
    }
    await documentApi.updateDocumentPartial({ collectionName: 'ms_spielergruppen', documentId, requestBody })
    return gruppe
  }

  function addMitglied(gruppe: Spielergruppe, login: string): Spielergruppe {
    if (gruppe.mitglieder.includes(login)) {
      return gruppe
    }
    return { ...gruppe, mitglieder: [...gruppe.mitglieder, login] }
  }

  function removeMitglied(gruppe: Spielergruppe, login: string): Spielergruppe {
    return { ...gruppe, mitglieder: gruppe.mitglieder.filter(mitglied => mitglied !== login) }
  }

  async function deleteSpielergruppe(documentId: string): Promise<void> {
    await documentApi._delete({ collectionName: 'ms_spielergruppen', documentId })
  }

  return { createSpielergruppe, findSpielergruppenByMitglied, saveSpielergruppe, addMitglied, removeMitglied, deleteSpielergruppe }
}
