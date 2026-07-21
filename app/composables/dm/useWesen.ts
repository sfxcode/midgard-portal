import type { Wesen, WesenModifikator } from '~/models'

export function useWesen() {
  function modifikatorErfahren(): WesenModifikator {
    return {
      grad: 3,
      gf: 9,
      st: 0,
      lp: '+2',
      ap: '+2W6',
      angriff: 2,
      raufen: 0,
      abwehr: 2,
      resistenzGeist: 2,
      resistenzKoerper: 1,
      schaden: ''
    }
  }

  function modifikatorSelten(): WesenModifikator {
    return {
      grad: 8,
      gf: 20,
      st: 0,
      lp: '+3',
      ap: '+4W6',
      angriff: 4,
      raufen: 0,
      abwehr: 3,
      resistenzGeist: 3,
      resistenzKoerper: 3,
      schaden: ''
    }
  }

  function modifikatorLegendaer(): WesenModifikator {
    return {
      grad: 12,
      gf: 32,
      st: 0,
      lp: '+5',
      ap: '+6W6',
      angriff: 6,
      raufen: 0,
      abwehr: 4,
      resistenzGeist: 4,
      resistenzKoerper: 4,
      schaden: '+1'
    }
  }

  function createWesen(name: string): Wesen {
    return {
      name,
      besitzer: '',
      kategorie: 'Hunde',
      grad: 1,
      gf: 1,
      lp: '2W6',
      ap: '2W6+2',
      ruestung: 'LR',
      st: 50,
      gw: 50,
      in: 50,
      b: 24,
      fliegend: 0,
      abwehr: 12,
      resistenzGeist: 11,
      resistenzKoerper: 13,
      mw: 0,
      angriffe: [{ name: 'Raufen', wert: 7, schaden: '1W6-2', bemerkung: '' }],
      besonderheiten: [],
      zauber: [],
      regionen: ['Grasland'],
      vorkommen: '',
      erfahren: modifikatorErfahren(),
      selten: modifikatorSelten(),
      legendaer: modifikatorLegendaer()
    }
  }

  function angriffeToString(wesen: Wesen): string {
    let result = ''
    wesen.angriffe.forEach((angriff, index) => {
      if (index > 0) {
        result = `${result}, `
      }
      result = result + angriff.name
      if (angriff.wert) {
        result = `${result} +${angriff.wert}`
      }
      if (angriff.schaden) {
        result = `${result} (${angriff.schaden})`
      }
      if (angriff.bemerkung) {
        result = `${result} / ${angriff.bemerkung}`
      }
    })

    return result
  }

  function besonderheitenToString(wesen: Wesen): string {
    let result = ''
    wesen.besonderheiten.forEach((besonderheit, index) => {
      if (index > 0) {
        result = `${result}, `
      }
      result = result + besonderheit.name
      if (besonderheit.wert && besonderheit.wert >= 0) {
        result = `${result} +${besonderheit.wert}`
      } else if (besonderheit.wert) {
        result = `${result} ${besonderheit.wert}`
      }
      if (besonderheit.bemerkung) {
        result = `${result} (${besonderheit.bemerkung})`
      }
    })

    return result
  }

  function zauberToString(wesen: Wesen): string {
    let result = ''
    wesen.zauber.forEach((zauber, index) => {
      if (index > 0) {
        result = `${result}, `
      }
      result = result + zauber.name
      if (zauber.wert) {
        result = `${result} +${zauber.wert}`
      }
      if (zauber.bemerkung) {
        result = `${result} (${zauber.bemerkung})`
      }
    })

    return result
  }

  function vorkommenToString(wesen: Wesen): string {
    let result = ''
    wesen.regionen.forEach((region, index) => {
      if (index > 0) {
        result = `${result}, `
      }
      result = result + region
    })
    if (wesen.vorkommen?.length > 0) {
      result = `${result} (${wesen.vorkommen})`
    }
    return result
  }

  return { createWesen, angriffeToString, besonderheitenToString, zauberToString, vorkommenToString }
}
