export interface BasisEigenschaft {
  st: number
  gs: number
  gw: number
  ko: number
  in: number
  zt: number
  au: number
  pa: number
  wk: number
  b: number
}

export interface MetaData {
  created: Date
  createdBy: string
  updated: Date
  updatedBy: string
}

export interface FertigkeitSlot {
  name: string
  wert: number
}

export interface AbenteurerFertigkeit {
  name: string
  basisWert: number
  bonus: number
  wert: number
}
