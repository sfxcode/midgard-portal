import type {Content} from 'pdfmake/interfaces'
import type {GeneratedWesenProperties, Wesen, WesenGeneratorRequest, WesenGeneratorResult, WesenModifikator, Zauber} from '~/models'
import {useDices} from '~/composables/tools/useDices'
import {useWesen} from '~/composables/dm/useWesen'

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

  function findZauberByName(name: string): Zauber | undefined {
    const zauber = zauberByName(name)
    if (!zauber && name.includes('(')) {
      // Some Zauber names in the data include parenthetical notes (e.g. "Feuerball (Feuer)"),
      // but the zauberByName function may not recognize them. Try stripping the parentheses.
      const strippedName = name.replace(/\s*\(.*?\)\s*/g, '').trim()
      return zauberByName(strippedName)
    }
    return zauber
  }

  function generateWesen(request: WesenGeneratorRequest): WesenGeneratorResult | undefined {
    const wesen = wesenByName(request.wesen)
    if (!wesen) {
      console.warn(`Wesen ${request.wesen} not found`)
      return undefined
    }
    const zauber: Zauber[] = wesen?.zauber.map(z => findZauberByName(z.name)).filter(z => z !== undefined) as Zauber[]

    return {
      wesen,
      zauber,
      standard: generateProperties(wesen, request.anzahl, request.bestOf),
      erfahren: generateProperties(wesen, request.anzahlErfahren, request.bestOf, wesen.erfahren),
      selten: generateProperties(wesen, request.anzahlSelten, request.bestOf, wesen.selten),
      legendaer: generateProperties(wesen, request.anzahlLegendaer, request.bestOf, wesen.legendaer)
    }
  }

  // Reproduces the book's boxed stat block layout (name/kategorie/Grad, LP/AP/
  // Rüstung, St/Gw/In/B, Abwehr/Resistenz, Angriff/Bes./Zaubern/Vorkommen -
  // see scratch/pdf/wesen_sample_in_pdf.png) so the generated PDF opens with
  // the same reference info a DM would look up in the book.
  function createWesenStatBlock(wesen: Wesen): Content[] {
    const {angriffeToString, besonderheitenToString, zauberToString, vorkommenToString} = useWesen()

    const rows: Content[] = [
      {text: `${wesen.name} (${wesen.kategorie}, Grad ${wesen.grad})`, style: 'subheader'},
      // A shared 4-column table (rather than two separate `columns` blocks)
      // so the LP/AP/Rüstung line and the St/Gw/In/B line below it share the
      // same tab stops - two independent `columns` rows with different item
      // counts (3 vs 4) each divide the full width on their own and don't
      // line up.
      {
        layout: 'noBorders',
        table: {
          widths: [90, 90, 90, '*'],
          body: [
            [`LP ${wesen.lp}`, `AP ${wesen.ap}`, wesen.ruestung, ''],
            [`St ${wesen.st}`, `Gw ${wesen.gw}`, `In ${wesen.in}`, `B ${wesen.fliegend > 0 ? `${wesen.b}/${wesen.fliegend}` : wesen.b}`]
          ]
        }
      },
      {
        text: [
          {text: 'Abwehr: ', bold: true},
          `+${wesen.abwehr}  `,
          {text: 'Resistenz: ', bold: true},
          `+${wesen.resistenzGeist}/${wesen.resistenzKoerper}`,
          ...(wesen.mw > 0 ? [`  MW${wesen.mw >= 999 ? ' ∞' : `+${wesen.mw}`}`] : [])
        ]
      }
    ]

    const angriffText = angriffeToString(wesen)
    if (angriffText) {
      rows.push({text: [{text: 'Angriff: ', bold: true}, angriffText]})
    }

    const besText = besonderheitenToString(wesen)
    if (besText) {
      rows.push({text: [{text: 'Bes.: ', bold: true}, besText]})
    }

    const zauberText = zauberToString(wesen)
    if (zauberText) {
      rows.push({text: [{text: 'Zaubern: ', bold: true}, zauberText]})
    }

    const vorkommenText = vorkommenToString(wesen)
    if (vorkommenText) {
      rows.push({text: [{text: 'Vorkommen: ', bold: true}, vorkommenText]})
    }

    return rows
  }

  // Number of blank tally boxes drawn after the LP/AP value, for crossing off
  // damage by hand during play (see scratch/IMG_3819.jpg) - a fixed track
  // length, not one box per point, matching the sketch.
  const TRACK_BOXES = 12

  // One small "<Name> N" tracker per generated instance: a 2-row table (LP/AP
  // label + rolled value) followed by a row of blank boxes.
  function createInstanceTracker(name: string, instance: GeneratedWesenProperties): Content[] {
    const boxes = Array.from({length: TRACK_BOXES}, () => '')
    return [
      {text: `${name} ${instance.index}`, bold: true, margin: [0, 6, 0, 2]},
      {
        layout: 'base',
        table: {
          dontBreakRows: true,
          widths: [30, 30, ...boxes.map(() => 20)],
          body: [
            [{text: 'LP', bold: true}, String(instance.lp), ...boxes],
            [{text: 'AP', bold: true}, String(instance.ap), ...boxes]
          ]
        }
      }
    ]
  }

  // A smaller, non-'subheader' label for the tier/zauber sections below the
  // main stat block, so they read as sub-sections rather than competing with
  // the stat block's own title.
  function sectionLabel(title: string): Content {
    return {text: title, bold: true, fontSize: 12, margin: [0, 8, 0, 2]}
  }

  // `title` is omitted for the "Standard" tier - it's the default case and
  // doesn't need its own heading above the trackers.
  function createInstancesSection(title: string | undefined, name: string, instances: GeneratedWesenProperties[]): Content[] {
    if (instances.length === 0) {
      return []
    }
    return [
      ...(title ? [sectionLabel(title)] : []),
      ...instances.flatMap(instance => createInstanceTracker(name, instance))
    ]
  }

  // Same columns/widths as useZauberExport's standard section, so a Zauber
  // table reads the same wherever it's printed in the app.
  function createZauberSection(zauber: Zauber[]): Content[] {
    if (zauber.length === 0) {
      return []
    }
    const headers = ['Stufe', 'Name', 'AP', 'Reichweite', 'Zauberdauer', 'Wirkungsbereich', 'Wirkungsdauer']
    const widths = ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto']
    return [
      sectionLabel('Zauber'),
      {
        layout: 'base',
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [...widths],
          body: [[...headers], ...zauber.map(z => [z.stufe, z.name, z.ap, z.reichweite, z.zauberdauer, z.wirkungsbereich, z.wirkungsdauer])]
        }
      }
    ]
  }

  async function exportWesen(request: WesenGeneratorRequest): Promise<void> {
    const result = generateWesen(request)
    if (!result) {
      console.warn(`Failed to generate Wesen for request: ${JSON.stringify(request)}`)
      return
    }

    const {defaultStyle, styleLibrary, tableLayouts, footer, pageHeader} = usePdf()

    const content: Content[] = [
      ...createWesenStatBlock(result.wesen),
      ...createInstancesSection(undefined, result.wesen.name, result.standard),
      ...createInstancesSection('Erfahren', result.wesen.name, result.erfahren),
      ...createInstancesSection('Selten', result.wesen.name, result.selten),
      ...createInstancesSection('Legendär', result.wesen.name, result.legendaer),
      ...createZauberSection(result.zauber)
    ]

    const pdfMake = usePDFMake()
    if (!pdfMake) {
      return
    }

    pdfMake.createPdf(
      {
        header: await pageHeader(),
        footer: footer(),
        content,
        styles: styleLibrary(),
        defaultStyle: defaultStyle()
      },
      tableLayouts()
    ).open()
  }


  return { generateWesen, exportWesen }
}
