import type { MetaData } from '~/models/base'

export interface ZauberLerneinheit {
  typ: string
  kategorie: string
  metaData: MetaData
}

export interface FertigkeitLerneinheit {
  typ: string
  kategorie: string
  metaData: MetaData
}
