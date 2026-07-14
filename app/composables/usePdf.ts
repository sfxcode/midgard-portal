import type { Content, CustomTableLayout, Style, StyleDictionary } from 'pdfmake/interfaces'

export function usePdf() {
  const bigMargin: [number, number, number, number] = [0, 10, 0, 30]
  const smallMargin: [number, number, number, number] = [0, 10, 0, 10]

  function styleLibrary(): StyleDictionary {
    return {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
      normal: { fontSize: 12, margin: [0, 5, 0, 5] },
      small: { fontSize: 8, margin: [0, 2, 0, 2] },
      bold: { bold: true },
      italic: { italics: true }
    }
  }

  function defaultStyle(): Style {
    return { color: 'black', fontSize: 10, margin: [0, 0, 0, 10] }
  }

  function tableLayouts(): Record<string, CustomTableLayout> {
    return {
      base: {
        fillColor(rowIndex: number) {
          return rowIndex % 2 !== 0 ? 'lightgray' : null
        },
        hLineColor: 'black',
        vLineColor: 'black'
      }
    }
  }

  function headerText(text: string): Content {
    return { text, style: 'header' }
  }

  function subheaderText(text: string): Content {
    return { text, style: 'subheader' }
  }

  return { defaultStyle, styleLibrary, tableLayouts, headerText, subheaderText, bigMargin, smallMargin }
}
