import type { MetaData } from '~/models/base'

export interface WesenModifikator {
  grad: number
  gf: number
  st: number
  lp: string
  ap: string
  angriff: number
  raufen: number
  abwehr: number
  resistenzGeist: number
  resistenzKoerper: number
  schaden: string
}

export interface WesenAngriff {
  name: string
  wert: number
  schaden: string
  bemerkung: string
}

export interface WesenBesonderheiten {
  name: string
  wert: number
  bemerkung: string
}

export interface WesenZauber {
  name: string
  wert: number
  bemerkung: string
}

export interface Wesen {
  name: string
  besitzer: string
  kategorie: string
  grad: number
  gf: number
  lp: string
  ap: string
  ruestung: string
  st: number
  gw: number
  in: number
  b: number
  fliegend: number
  abwehr: number
  resistenzGeist: number
  resistenzKoerper: number
  mw: number
  angriffe: Array<WesenAngriff>
  besonderheiten: Array<WesenBesonderheiten>
  zauber: Array<WesenZauber>
  regionen: Array<string>
  vorkommen: string
  erfahren: WesenModifikator
  selten: WesenModifikator
  legendaer: WesenModifikator
  metaData?: MetaData
  _id?: string
}
