import type { Zauber, ZauberLernen } from '~/models'

export function useZauber() {
  const stufenMap = new Map<number, number>([
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 3],
    [5, 5],
    [6, 10],
    [7, 15],
    [8, 20],
    [9, 30],
    [10, 40],
    [11, 60],
    [12, 90]
  ])

  function calculateZauberEpKosten(kategorie: string, prozess: string, einheitenMap: Map<string, number>, isElf: boolean): number {
    let epKosten = 0
    if (einheitenMap.has(kategorie)) {
      epKosten = einheitenMap.get(kategorie) as number
    } else if (kategorie === 'Zauberspruch' && einheitenMap.has(prozess)) {
      epKosten = einheitenMap.get(prozess) as number
    }
    if (isElf && epKosten > 0) {
      epKosten = epKosten + 6
    }
    return epKosten
  }

  function calculateZauberLernKosten(kategorie: string, prozess: string, stufe: number, einheitenMap: Map<string, number>, isElf: boolean): number {
    const epKosten = calculateZauberEpKosten(kategorie, prozess, einheitenMap, isElf)
    const le = stufenMap.get(stufe) ?? 0
    return epKosten * le
  }

  function calculateZauberGold(stufe: number): number {
    const le = stufenMap.get(stufe) ?? 0
    return 100 * le
  }

  function zauberLernenByTyp(zauber: Zauber[], typName: string, isElf: boolean, zauberLerneinheitenByTyp: (typ: string) => Array<{ kategorie: string, kosten: number }>) {
    const einheitenMap: Map<string, number> = new Map<string, number>()
    if (typName) {
      const lerneinheiten = zauberLerneinheitenByTyp(typName)
      lerneinheiten.forEach((e) => {
        einheitenMap.set(e.kategorie, e.kosten)
      })
    }
    let result = zauber.map((zauber: Zauber) => {
      return {
        zauber,
        epKosten: calculateZauberEpKosten(zauber.kategorie, zauber.prozess, einheitenMap, isElf),
        kosten: calculateZauberLernKosten(zauber.kategorie, zauber.prozess, zauber.stufe, einheitenMap, isElf),
        gold: calculateZauberGold(zauber.stufe),
        name: zauber.name,
        kategorie: zauber.kategorie,
        art: zauber.art,
        stufe: zauber.stufe,
        ap: zauber.ap,
        zauberdauer: zauber.zauberdauer,
        prozess: zauber.prozess
      } as ZauberLernen
    })
    result = result.filter(zauberLernen => zauberLernen.kosten > 0 || !typName)
    return result
  }

  return { calculateZauberEpKosten, calculateZauberLernKosten, calculateZauberGold, zauberLernenByTyp }
}
