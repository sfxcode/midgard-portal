export function useFertigkeit() {
  function calculateFertigkeitEpKosten(kategorie: string, einheitenMap: Map<string, number>): number {
    return einheitenMap.get(kategorie) ?? 0
  }

  function calculateFertigkeitLernKosten(kategorie: string, lerneinheiten: number, einheitenMap: Map<string, number>, isElf: boolean): number {
    const trainingKosten = calculateFertigkeitEpKosten(kategorie, einheitenMap)
    let kosten = 3 * trainingKosten
    if (isElf) {
      kosten = kosten + 6
    }
    kosten = kosten * lerneinheiten
    return kosten
  }

  return { calculateFertigkeitEpKosten, calculateFertigkeitLernKosten }
}
