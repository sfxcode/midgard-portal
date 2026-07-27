import type { MetaData } from '~/models/base'

export interface Spieler {
  _id?: string
  login: string
  name: string
  email?: string
  avatar?: string
  metaData: MetaData
}

export interface Spielergruppe {
  _id?: string
  name: string
  beschreibung?: string
  mitglieder: string[]
  metaData: MetaData
}

export interface Kampagne {
  _id?: string
  name: string
  beschreibung?: string
  spielleiter: string
  spieler: string[]
  metaData: MetaData
}
