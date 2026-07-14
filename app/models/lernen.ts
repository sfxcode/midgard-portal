import type { MetaData } from '~/models/base'

export interface ZauberLerneinheit {
  typ: string
  kategorie: string
  kosten: number
  metaData: MetaData
}

export interface FertigkeitLerneinheit {
  typ: string
  kategorie: string
  kosten: number
  metaData: MetaData
}
