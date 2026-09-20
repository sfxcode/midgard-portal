import type { Content } from 'pdfmake/interfaces'
import type { Typ } from '~/models'

type TypRow = Array<string>

export function useTypenExport() {
  const { defaultStyle, styleLibrary, tableLayouts, footer, pageHeader, smallMargin } = usePdf()

  function toRow(t: Typ): TypRow {
    return [t.name, t.nameKurz, t.buch]
  }

  function createTypSection(title: string, data: Typ[]): Content[] {
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
          widths: ['*', 'auto', 'auto'],
          body: [['Name', 'Bez.', 'Buch'], ...data.map(toRow)]
        }
      }
    ]
  }

  async function exportTypenData(typen: Typ[], title: string = 'Typen Blatt') {
    const kategorien = Array.from(new Set(typen.map(t => t.kategorie))).sort()

    const content: Content[] = [
      { text: title, style: 'header' },
      ...kategorien.flatMap(kategorie =>
        createTypSection(kategorie, typen.filter(t => t.kategorie === kategorie)))
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

  return { exportTypenData }
}
