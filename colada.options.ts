// colada.options.ts
import type { PiniaColadaOptions } from '@pinia/colada'
import { PiniaColadaCachePersister } from '@pinia/colada-plugin-cache-persister'

export default {
  plugins: [
    PiniaColadaCachePersister({
      // key: 'pinia-colada-cache',
      // storage: () => localStorage,
      // debounce: 1000,
      // stringify: JSON.stringify,
      // parse: JSON.parse,
    }),
  ],
  queryOptions: {
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  },
} satisfies PiniaColadaOptions
