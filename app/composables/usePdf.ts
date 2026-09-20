import type { Content, CustomTableLayout, Style, StyleDictionary } from 'pdfmake/interfaces'

const HEADER_LOGO_PATH = '/images/heroes/abenteurer.svg'
const HEADER_GRAY = '#666666'
let headerLogoSvg: Promise<string> | null = null

function loadHeaderLogo(): Promise<string> {
  // responseType 'text' is required: without it, ofetch parses the response based on
  // the server's Content-Type (image/svg+xml for a static .svg), which can hand back
  // something other than a plain string - pdfmake's SVG measurer then throws
  // "Invalid SVG document" and aborts the whole PDF.
  headerLogoSvg ??= $fetch<string>(HEADER_LOGO_PATH, { responseType: 'text' }).then(svg =>
    // The SVG hardcodes fill="#000000" rather than using currentColor, so pdfmake's
    // `color` property has nothing to inherit into - recolor the markup directly.
    svg.replace(/fill="#000000"/, `fill="${HEADER_GRAY}"`)
  )
  return headerLogoSvg
}

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

  function footer(creationDate: Date = new Date()) {
    const formattedDate = creationDate.toLocaleDateString('de-DE')
    return (currentPage: number, pageCount: number): Content => ({
      columns: [
        { text: `Erstellt am ${formattedDate}`, alignment: 'left' },
        // The page-1 header banner already carries the branding - repeat it here
        // (centered) only on later pages, since those pages get no header at all.
        { text: currentPage > 1 ? 'Midgard Tools' : '', alignment: 'center' },
        { text: `${currentPage} von ${pageCount}`, alignment: 'right' }
      ],
      margin: [40, 10, 40, 20]
    })
  }

  async function pageHeader(): Promise<((currentPage: number, pageCount: number) => Content | null) | undefined> {
    try {
      const svg = await loadHeaderLogo()
      return (currentPage: number): Content | null => {
        // Only the first page gets the branding - repeating it on every page was
        // visually noisy for multi-page exports.
        if (currentPage !== 1) {
          return null
        }
        return {
          columns: [
            // Empty '*' spacer pushes the logo+text group flush against the right
            // margin - same right border (40) the footer and body content use.
            //
            // pdfmake bug: a `margin` on the svg/text column here (instead of the
            // `columnGap` below) makes that column silently render nothing, and an
            // `'auto'`/omitted `width` on either column does the same - both were
            // confirmed by reproducing headers outside the browser. Explicit numeric
            // widths + columnGap is the only combination that reliably renders.
            { text: '', width: '*' },
            // Top margin nudges the (short) icon down to visually center it against
            // the (taller) text next to it - `columns` items otherwise always
            // top-align. Safe here: it's `height` on the svg, or any `margin` on the
            // text column, that triggers the invisibility bug - not a plain top
            // `margin` on the svg.
            { svg, width: 24, margin: [0, 4, 0, 0] },
            { text: 'Midgard Tools', bold: true, fontSize: 16, width: 110, color: HEADER_GRAY }
          ],
          columnGap: 6,
          margin: [0, 12, 40, 0]
        }
      }
    } catch (error) {
      console.error('Failed to load PDF header logo, continuing without it', error)
      return undefined
    }
  }

  return { defaultStyle, styleLibrary, tableLayouts, headerText, subheaderText, footer, pageHeader, bigMargin, smallMargin }
}
