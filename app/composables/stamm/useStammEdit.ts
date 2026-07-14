import type { MetaData } from '~/models'

export function useStammEdit() {
  const { documentApi } = useMongocampApi()
  const { ensureMetaData } = useMongocampDocument()

  async function saveStammDocument<T extends { _id?: string, metaData?: MetaData }>(collectionName: string, data: T) {
    const { _id: documentId, ...rest } = data
    if (!documentId) {
      return
    }
    const requestBody = ensureMetaData(rest) as unknown as Record<string, string>
    await documentApi.updateDocumentPartial({ collectionName, documentId, requestBody })
  }

  return { saveStammDocument }
}
