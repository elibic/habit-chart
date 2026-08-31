/**
 * The fonts an element can be set in.
 *
 * Each option carries its own weight, because these families do not share a
 * range: Suez One, Secular One and Varela Round ship a single 400 face, and
 * asking a browser for 600 on one of those gets a synthesised bold — thicker
 * on one axis than the other, and visibly wrong in print.
 *
 * `stack: null` is the element's own default, which is how a heading keeps
 * following the design rather than being frozen the first time it is touched.
 */
export const FONT_OPTIONS = [
  { id: 'default', label: 'ברירת מחדל', stack: null, weight: null },
  { id: 'fredoka', label: 'עגול ומשחקי', stack: "'Fredoka'", weight: 600 },
  { id: 'suez', label: 'כבד ומודגש', stack: "'Suez One'", weight: 400 },
  { id: 'secular', label: 'נקי וחזק', stack: "'Secular One'", weight: 400 },
  { id: 'varela', label: 'רך ועגלגל', stack: "'Varela Round'", weight: 400 },
  { id: 'amatic', label: 'כתב יד', stack: "'Amatic SC'", weight: 700 },
  { id: 'rubik', label: 'גיאומטרי', stack: "'Rubik'", weight: 700 },
  { id: 'heebo', label: 'נייטרלי', stack: "'Heebo'", weight: 700 },
]

const FALLBACK = "'Heebo', 'Arial Hebrew', system-ui, sans-serif"

export function getFont(id) {
  return FONT_OPTIONS.find((f) => f.id === id) ?? FONT_OPTIONS[0]
}

/** The chosen family as a full stack, or null to leave the element's own. */
export function fontStack(id) {
  const font = getFont(id)
  return font.stack ? `${font.stack}, ${FALLBACK}` : null
}
