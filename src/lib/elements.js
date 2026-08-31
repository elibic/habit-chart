/**
 * The four things that float over the sheet: the topic ribbon, the child's
 * name, the date chip and the footer plaque.
 *
 * Each one can be moved, resized, recoloured, restyled, retitled and hidden.
 * They are positioned in percentages of the sheet rather than millimetres, so
 * a layout arranged on A4 lands in the same place on A3.
 *
 * `bg` and `fg` are null until someone picks a colour. Null means "follow the
 * theme", which is what keeps a moved element from freezing the palette of
 * whichever theme happened to be on screen when it was moved.
 */

import { fontStack, getFont } from './fonts'

/** The four that always exist. Images are added alongside them at runtime. */
export const FIXED_IDS = ['topic', 'name', 'dateChip', 'plaque']

/** Images first, so a heading is never buried under a photo. */
export function orderedIds(elements) {
  const images = Object.keys(elements).filter((id) => elements[id].kind === 'image')
  return [...images, ...FIXED_IDS]
}

export const ELEMENT_DEFS = {
  topic: {
    label: 'שם הנושא',
    hint: 'הסרט העליון',
    // Which settings field holds this element's words, if any. The date chip
    // is computed from the calendar and has nothing to type.
    textKey: 'topic',
    textLabel: 'הטקסט',
    defaults: { visible: true, x: 50, y: 8.5, scale: 1, rotate: 0, bg: null, fg: null, style: 'pill', font: 'default' },
  },
  name: {
    label: 'שם הילד/ה',
    hint: 'הכותרת הגדולה',
    textKey: 'childName',
    textLabel: 'השם',
    defaults: { visible: true, x: 50, y: 17.5, scale: 1, rotate: 0, bg: null, fg: null, style: 'plain', font: 'default' },
  },
  dateChip: {
    label: 'כרטיס התאריך',
    hint: 'החודש או הטווח',
    textKey: null,
    defaults: { visible: true, x: 11, y: 13, scale: 1, rotate: 0, bg: null, fg: null, style: 'card', font: 'default' },
  },
  plaque: {
    label: 'משפט העידוד',
    hint: 'הכותרת התחתונה',
    textKey: 'plaqueText',
    textLabel: 'הטקסט',
    defaults: { visible: true, x: 50, y: 95, scale: 1, rotate: 0, bg: null, fg: null, style: 'pill', font: 'default' },
  },
}

export const STYLE_OPTIONS = [
  { value: 'pill', label: 'גלולה' },
  { value: 'card', label: 'כרטיס' },
  { value: 'plain', label: 'ללא רקע' },
]

export function defaultElements() {
  return Object.fromEntries(
    FIXED_IDS.map((id) => [id, { kind: 'text', ...ELEMENT_DEFS[id].defaults }]),
  )
}

/** How an image meets the page. */
export const EDGE_OPTIONS = [
  { value: 'plain', label: 'ישר' },
  { value: 'rounded', label: 'פינות' },
  { value: 'circle', label: 'עיגול' },
  { value: 'soft', label: 'טשטוש' },
  { value: 'frame', label: 'מסגרת' },
]

let imageCounter = 0
export function newImageElement(src) {
  imageCounter += 1
  return {
    id: `image-${Date.now()}-${imageCounter}`,
    element: {
      kind: 'image',
      src,
      visible: true,
      x: 50,
      y: 50,
      scale: 1,
      rotate: 0,
      edge: 'rounded',
      frameColor: '#ffffff',
      // Images start at a quarter of the sheet's width; `scale` takes it from
      // there, so one slider covers size for both kinds of element.
      width: 25,
    },
  }
}

/** Position, size, tilt, font and any colour overrides, as inline CSS. */
export function elementStyle(el) {
  const style = {
    left: `${el.x}%`,
    top: `${el.y}%`,
    '--el-scale': el.scale,
    '--el-rotate': `${el.rotate}deg`,
  }
  if (el.bg) style['--el-bg'] = el.bg
  if (el.fg) style['--el-fg'] = el.fg
  if (el.kind === 'image') {
    style.width = `${el.width}%`
    style['--el-frame'] = el.frameColor
    return style
  }
  const stack = fontStack(el.font)
  if (stack) {
    style['--el-font'] = stack
    style['--el-weight'] = getFont(el.font).weight
  }
  return style
}
