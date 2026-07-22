import type { Abenteurer, BasisEigenschaft, MetaData } from '~/models'

export function useAbenteurer() {
  function createAbenteurer(name: string, spieler: string, typ: string): Abenteurer {
    return {
      name,
      spieler,
      typ,
      grad: 1,
      lp: 14,
      ap: 8,
      gg: 0,
      sg: 0,
      angriff: 0,
      raufen: 0,
      abwehr: 0,
      zaubern: 0,
      resistenzGeist: 0,
      resistenzKoerper: 0,
      basis: { st: 50, gs: 50, gw: 50, ko: 50, in: 50, zt: 50, au: 50, pa: 50, wk: 50, b: 24 } as BasisEigenschaft,
      zauber: [],
      zauberAngeboren: [],
      fertigkeiten: [],
      fertigkeitenAngeboren: [],
      werte: {},
      metaData: {} as MetaData
    }
  }

  return { createAbenteurer }
}
