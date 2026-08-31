/**
 * Page geometry, in millimetres.
 *
 * The sheet is built at its true printed size rather than in screen pixels,
 * so what the preview shows is literally what comes out of the printer — the
 * preview is the same sheet under a CSS transform.
 *
 * A3 is exactly A4 scaled by sqrt(2), so every measurement below is written
 * once for A4 landscape and multiplied by `k`. That keeps the two paper sizes
 * visually identical instead of letting A3 drift into a different design.
 */
export const PAPERS = {
  A4: { id: 'A4', label: 'A4 (297×210 מ״מ)', width: 297, height: 210 },
  A3: { id: 'A3', label: 'A3 (420×297 מ״מ)', width: 420, height: 297 },
}

export const PAPER_LIST = Object.values(PAPERS)

const MM_PER_PX = 25.4 / 96

export function mmToPx(mm) {
  return mm / MM_PER_PX
}

/**
 * Works out every measurement the sheet needs for one particular
 * paper size / week count / sticker count combination.
 */
export function computeLayout({ paperId, weeks, stickersPerDay }) {
  const paper = PAPERS[paperId] ?? PAPERS.A4
  const k = paper.width / PAPERS.A4.width // 1 for A4, ~1.414 for A3

  // A six-week month has to give the banner and the plaque some height back,
  // otherwise the sticker circles get squeezed to nothing.
  const tight = weeks >= 6

  const pad = 5 * k
  const headerHeight = (tight ? 38 : 44) * k
  const footerHeight = (tight ? 15 : 19) * k
  // Wide enough that the panel clears the characters an image generator
  // actually draws. Asked for the outer 8%, it returns 12-13%, and the panel
  // was covering the whole side cast. Costs nothing: the sticker circles are
  // limited by row height, not column width, at every week count.
  const gutter = (tight ? 29 : 32) * k
  const dowHeight = (tight ? 9 : 10) * k
  const gap = 0.7 * k
  const panelPad = 1.6 * k

  const bodyHeight = paper.height - pad * 2 - headerHeight - footerHeight
  const gridWidth = paper.width - pad * 2 - gutter * 2 - panelPad * 2
  const rowsHeight = bodyHeight - dowHeight - panelPad * 2 - gap

  // Capped: a two-week chart stretched to fill the sheet gives cells the size
  // of postcards and a page that is all table. Past the cap the grid keeps its
  // height and centres in what is left, letting the artwork through.
  const rowHeight = Math.min((rowsHeight - gap * (weeks - 1)) / weeks, 30 * k)
  const gridHeight = rowHeight * weeks + gap * (weeks - 1)
  const colWidth = (gridWidth - gap * 6) / 7

  // The sticker circles are the point of the whole page, so they get whatever
  // room is left after the Hebrew date and (for two-a-day) its label.
  const dateRow = 5.4 * k
  const slotLabel = stickersPerDay === 2 ? 4 * k : 0
  const innerPad = 1.4 * k
  const slotGap = 1.4 * k

  const widthCap =
    (colWidth - innerPad * 2 - slotGap * (stickersPerDay - 1)) / stickersPerDay
  const heightCap = rowHeight - dateRow - slotLabel - innerPad * 2
  const sticker = Math.max(5 * k, Math.min(widthCap, heightCap, 24 * k))

  return {
    paper,
    k,
    pad,
    headerHeight,
    footerHeight,
    gutter,
    dowHeight,
    gap,
    panelPad,
    bodyHeight,
    rowHeight,
    gridHeight,
    colWidth,
    sticker,
    slotGap,
    innerPad,
    dateRow,
    slotLabel,
  }
}

/** The layout numbers, as the CSS custom properties the stylesheet reads. */
export function layoutCssVars(layout) {
  const mm = (value) => `${value.toFixed(3)}mm`
  return {
    '--sheet-w': mm(layout.paper.width),
    '--sheet-h': mm(layout.paper.height),
    '--sheet-pad': mm(layout.pad),
    '--header-h': mm(layout.headerHeight),
    '--footer-h': mm(layout.footerHeight),
    '--gutter-w': mm(layout.gutter),
    '--dow-h': mm(layout.dowHeight),
    '--cell-gap': mm(layout.gap),
    '--panel-pad': mm(layout.panelPad),
    '--row-h': mm(layout.rowHeight),
    '--grid-h': mm(layout.gridHeight),
    '--sticker-d': mm(layout.sticker),
    '--slot-gap': mm(layout.slotGap),
    '--inner-pad': mm(layout.innerPad),
    '--date-h': mm(layout.dateRow),
    '--slot-label-h': mm(layout.slotLabel),
    '--k': layout.k.toFixed(4),
  }
}
