import type { Content } from 'pdfmake/interfaces'
import type { Typ } from '~/models'

type TypRow = Array<string>

export function useTypenExport() {
  const { defaultStyle, styleLibrary, tableLayouts, smallMargin } = usePdf()

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
          widths: ['*', 'auto', 'auto'],
          body: [['Name', 'Bez.', 'Buch'], ...data.map(toRow)]
        }
      }
    ]
  }

  function exportTypenData(typen: Typ[], title: string = 'Typen Blatt') {
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

  return { exportTypenData }
}
