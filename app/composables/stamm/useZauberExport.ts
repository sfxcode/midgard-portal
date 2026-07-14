import type { Content } from 'pdfmake/interfaces'
import type { Zauber } from '~/models'

type ZauberRow = Array<string | number>

export function useZauberExport() {
  const { defaultStyle, styleLibrary, tableLayouts, smallMargin } = usePdf()

  function filterZauberByDauer(zauberData: Zauber[], zauberdauer: string): ZauberRow[] {
    const filtered = zauberData.filter(z => z.zauberdauer === zauberdauer)
    return filtered.map(z => [
      z.stufe,
      z.name,
      z.ap,
      z.reichweite,
      z.kategorie,
      z.wirkungsbereich,
      z.wirkungsdauer
    ])
  }

  function filterZauberOther(zauberData: Zauber[], excludeDauers: string[]): ZauberRow[] {
    const filtered = zauberData.filter(z => !excludeDauers.includes(z.zauberdauer))
    return filtered.map(z => [
      z.stufe,
      z.zauberdauer,
      z.name,
      z.ap,
      z.reichweite,
      z.kategorie,
      z.wirkungsbereich,
      z.wirkungsdauer
    ])
  }

  function createZauberSection(title: string, headers: string[], data: ZauberRow[], widths: Array<string | number>): Content[] {
    return [
      {
        text: title,
        margin: smallMargin,
        style: { alignment: 'center', fontSize: 20, bold: true }
      },
      {
        layout: 'base',
        table: {
          widths,
          body: [headers, ...data]
        }
      }
    ]
  }

  function exportZauberData(filterZauber: string[], title: string = 'Zauber Blatt') {
    const standardWidths = ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto']
    const sonstigeWidths = ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto']
    const standardHeaders = ['Stufe', 'Name', 'AP', 'Reichweite', 'Kategorie', 'Wirkungsbereich', 'Wirkungsdauer']
    const sonstigeHeaders = ['Stufe', 'Zauberdauer', 'Name', 'AP', 'Reichweite', 'Kategorie', 'Wirkungsbereich', 'Wirkungsdauer']

    const { filterZauberByNames } = useZauberStore()
    const zauber = filterZauberByNames(filterZauber)

    const content: Content[] = [
      { text: title, style: 'header' },
      ...createZauberSection('Augenblick Zauber', standardHeaders, filterZauberByDauer(zauber, 'Augenblick'), standardWidths),
      ...createZauberSection('10 Sekunden Zauber', standardHeaders, filterZauberByDauer(zauber, '10 sec'), standardWidths),
      ...createZauberSection('20 Sekunden Zauber', standardHeaders, filterZauberByDauer(zauber, '20 sec'), standardWidths),
      ...createZauberSection('Sonstige Zauber', sonstigeHeaders, filterZauberOther(zauber, ['Augenblick', '10 sec', '20 sec']), sonstigeWidths)
    ]

    const pdfMake = usePDFMake()
    if (!pdfMake) {
      return
    }

    pdfMake.createPdf(
      {
        footer(currentPage: number, pageCount: number) {
          return `${currentPage} of ${pageCount}`
        },
        content,
        styles: styleLibrary(),
        defaultStyle: defaultStyle()
      },
      tableLayouts()
    ).open()
  }

  return { exportZauberData }
}
