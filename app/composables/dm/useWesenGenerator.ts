import type {GeneratedWesenProperties, Wesen, WesenGeneratorRequest, WesenGeneratorResult, WesenModifikator, Zauber} from '~/models'
import {useDices} from '~/composables/tools/useDices'

export function useWesenGenerator() {
  const {wesenByName} = useBestiariumStore()
  const {zauberByName} = useZauberStore()
  const {diceRollResult} = useDices()

  // Wesen lp/ap data was extracted from a PDF and sometimes carries stray
  // characters (footnote text, "*"/"∞" placeholders, stray spaces) alongside
  // the actual dice notation - strip everything but digits, W/w and +/-.
  function sanitizeNotation(notation: string): string {
    const cleaned = notation.replace(/[^0-9wW+-]/g, '')
    return cleaned.startsWith('+') ? cleaned.slice(1) : cleaned
  }

  // Rolls the full notation `bestOf` times and keeps the highest total - a
  // "roll twice, take the better" mechanic, not a single roll's dice pool.
  // A notation that fails to parse on every attempt (e.g. "*", "∞") falls
  // back to 0, same as a single failed roll did before.
  function rollValue(notation: string, bestOf: number): number {
    const cleaned = sanitizeNotation(notation)
    // No dice part at all (e.g. "1", "+2") - nothing to roll, so just use the
    // numeric value directly (a leading "+" parses fine as a positive number).
    if (!/[wW]/.test(cleaned)) {
      return Number(cleaned) || 0
    }
    const attempts = Math.max(1, bestOf || 1)
    let best: number | undefined
    for (let i = 0; i < attempts; i++) {
      try {
        const total = diceRollResult(cleaned).total
        if (best === undefined || total > best) {
          best = total
        }
      } catch {
        // ignore this attempt; another attempt (or the 0 fallback below) covers it
      }
    }
    return best ?? 0
  }

  function generateProperties(wesen: Wesen, anzahl: number, bestOf: number, bonus?: WesenModifikator): GeneratedWesenProperties[] {
    const result: GeneratedWesenProperties[] = []
    for (let index = 1; index <= anzahl; index++) {
      result.push({
        index,
        // A low/negative dice roll (e.g. "1W6-2") or an unparseable notation
        // (falls back to 0) should never produce a Wesen with 0 or fewer LP/AP.
        lp: Math.max(1, rollValue(wesen.lp, bestOf) + (bonus ? rollValue(bonus.lp, bestOf) : 0)),
        ap: Math.max(1, rollValue(wesen.ap, bestOf) + (bonus ? rollValue(bonus.ap, bestOf) : 0))
      })
    }
    return result
  }

  function generateWesen(request: WesenGeneratorRequest): WesenGeneratorResult | undefined {
    const wesen = wesenByName(request.wesen)
    if (!wesen) {
      console.warn(`Wesen ${request.wesen} not found`)
      return undefined
    }
    const zauber: Zauber[] = wesen?.zauber.map(z => zauberByName(z.name)).filter(z => z !== undefined) as Zauber[]

    return {
      wesen,
      zauber,
      standard: generateProperties(wesen, request.anzahl, request.bestOf),
      erfahren: generateProperties(wesen, request.anzahlErfahren, request.bestOf, wesen.erfahren),
      selten: generateProperties(wesen, request.anzahlSelten, request.bestOf, wesen.selten),
      legendaer: generateProperties(wesen, request.anzahlLegendaer, request.bestOf, wesen.legendaer)
    }
  }


  return { generateWesen }
}
