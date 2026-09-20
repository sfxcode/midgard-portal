import type { Content } from 'pdfmake/interfaces'
import type { Fertigkeit } from '~/models'

type FertigkeitRow = Array<string | number>

export function useFertigkeitenExport() {
  const { defaultStyle, styleLibrary, tableLayouts, footer, pageHeader, smallMargin } = usePdf()

  function toRow(f: Fertigkeit): FertigkeitRow {
    return [f.name, f.leitwert, f.art, f.schwierigkeit, f.lerneinheiten, f.ungelernt, f.gelernt]
  }

  function createFertigkeitSection(title: string, data: Fertigkeit[]): Content[] {
    return [
      {
        text: title,
        margin: smallMargin,
        style: { alignment: 'center', fontSize: 20, bold: true }
      },
      {
        layout: 'base',
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: [['Name', 'Leitwert', 'Art', 'Schwierigkeit', 'LE', 'Ungelernt', 'Gelernt'], ...data.map(toRow)]
        }
      }
    ]
  }

  async function exportFertigkeitenData(fertigkeiten: Fertigkeit[], title: string = 'Fertigkeiten Blatt') {
    const kategorien = Array.from(new Set(fertigkeiten.map(f => f.kategorie))).sort()

    const content: Content[] = [
      { text: title, style: 'header' },
      ...kategorien.flatMap(kategorie =>
        createFertigkeitSection(kategorie, fertigkeiten.filter(f => f.kategorie === kategorie)))
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

  return { exportFertigkeitenData }
}
