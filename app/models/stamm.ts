import type { BasisEigenschaft, FertigkeitSlot, MetaData } from '~/models/base'

export interface Rasse {
  name: string
  basisMinimum: BasisEigenschaft
  basisMaximum: BasisEigenschaft
  fertigkeiten: Array<FertigkeitSlot>
  zauber: Array<string>
  metaData: MetaData
  _id?: string
}

export interface Typ {
  name: string
  nameKurz: string
  kategorie: string
  zauberTypen: Array<string>
  zauberProzesse: Array<string>
  basisFertigkeiten: Array<string>
  basisZauber: Array<string>
  alltag: number
  freiland: number
  halbwelt: number
  kampf: number
  koerper: number
  sozial: number
  unterwelt: number
  waffen: number
  wissen: number
  zauber: number
  buch: string
  metaData: MetaData
  _id?: string
}
export interface Zauber {
  name: string
  kategorie: string
  art: string
  stufe: number
  ap: string
  zauberdauer: string
  reichweite: string
  wirkungsziel: string
  wirkungsbereich: string
  wirkungsdauer: string
  ursprung: string
  prozess: string
  agens: string
  reagens: string
  material: string
  spruch: string
  metaData: MetaData
  _id?: string
}

export interface Fertigkeit {
  name: string
  kategorie: string
  leitwert: string
  ungelernt: number
  gelernt: number
  schwierigkeit: string
  lerneinheiten: number
  art: string
  buch: string
  metaData: MetaData
  _id?: string
}

export interface FernkampfWaffe {
  name: string
  gruppe: string
  mindestwert: string
  schwierigkeit: string
  schaden: string
  nah: number
  mittel: number
  fern: number
  kosten: number
  zweitGruppe: string
  zweitSchaden: string
  bemerkung: string
  buch: string
  metaData: MetaData
  _id?: string
}

export interface NahkampfWaffe {
  name: string
  gruppe: string
  mindestwert: string
  schwierigkeit: string
  hieb: string
  stich: string
  sturm: string
  kosten: number
  waffenart: string
  zweitGruppe: string
  zweitSchaden: string
  bemerkung: string
  buch: string
  metaData: MetaData
  _id?: string
}

export interface Gegenstand {
  name: string
  kategorie: string
  gewicht: number
  kosten: number
  buch: string
  metaData: MetaData
  _id?: string
}

export interface Behaelter {
  name: string
  beschreibung: string
  tragkraft: number
  gewicht: number
  kosten: number
  buch: string
  metaData: MetaData
  _id?: string
}

export interface Ruestung {
  name: string
  nameKurz: string
  metaData: MetaData
  _id?: string
}

export interface ZauberLernen {
  zauber: Zauber
  epKosten: number
  kosten: number
  gold: number
  name: string
  kategorie: string
  art: string
  stufe: number
  ap: string
  zauberdauer: string
  prozess: string
}

export interface FertigkeitLernen {
  fertigkeit: Fertigkeit
  epKosten: number
  kosten: number
  gold: number
  name: string
  uniqueName: string
  kategorie: string
  leitwert: string
  ungelernt: number
  gelernt: number
  schwierigkeit: string
  lerneinheiten: number

}

export interface Beschreibung {
  name: string
  kategorie: string
  content: string
  metaData: MetaData
  _id?: string
}
