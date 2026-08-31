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

export const ELEMENT_IDS = ['topic', 'name', 'dateChip', 'plaque']

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
    ELEMENT_IDS.map((id) => [id, { ...ELEMENT_DEFS[id].defaults }]),
  )
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
  const stack = fontStack(el.font)
  if (stack) {
    style['--el-font'] = stack
    style['--el-weight'] = getFont(el.font).weight
  }
  return style
}
