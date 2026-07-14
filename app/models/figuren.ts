import type { AbenteurerFertigkeit, BasisEigenschaft, MetaData } from '~/models/base'

export interface Abenteurer {
  name: string
  spieler: string
  typ: string
  grad: number
  lp: number
  ap: number
  gg: number
  sg: number
  angriff: number
  raufen: number
  abwehr: number
  zaubern: number
  resistenzGeist: number
  resistenzKoerper: number
  basis: BasisEigenschaft
  zauber: Array<string>
  zauberAngeboren: Array<string>
  fertigkeiten: Array<AbenteurerFertigkeit>
  fertigkeitenAngeboren: Array<AbenteurerFertigkeit>
  werte: { [key: string]: unknown }
  metaData: MetaData
  _id?: string
}
