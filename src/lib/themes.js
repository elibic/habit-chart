/**
 * A theme is a palette plus a folder of artwork.
 *
 * The palette is built for print on a child's wall, in the visual language
 * modern kids' design actually uses: a tinted paper ground with two soft
 * blobs washed across it, white day cards floating on a faintly tinted
 * panel, one confident accent doing the loud work and a second hue for
 * support. No sunbursts, no keylines, no gold.
 *
 * Token roles:
 *   ground / blobA / blobB / confetti  the sheet's background wash
 *   accent / accentDeep                the loud colour: name, pills, plaque
 *   support / supportDeep              the second hue: Shabbat, sun and moon
 *   panel / cell / highlight           the calendar surfaces
 *   ink                                text, biased toward the accent's hue
 */
export const THEMES = [
  {
    id: 'rescue-blue',
    name: 'כחול הצלה',
    emoji: '🚓',
    colors: {
      ground: '#DCEDFF',
      blobA: '#F3F9FF',
      blobB: '#B7DBFF',
      confetti: '#FFFFFF',
      ink: '#12395F',
      accent: '#2F7FE8',
      accentDeep: '#1A5AAE',
      support: '#FFB93B',
      supportDeep: '#CE8A11',
      panel: '#F4F8FD',
      cell: '#FFFFFF',
      highlight: '#FFF5E2',
    },
    fallbacks: { hero: '👮', cast: '🚑' },
  },
  {
    id: 'fire-red',
    name: 'אדום כבאית',
    emoji: '🚒',
    colors: {
      ground: '#FFE6DC',
      blobA: '#FFF6F1',
      blobB: '#FFC7B2',
      confetti: '#FFFFFF',
      ink: '#5B2213',
      accent: '#F0563F',
      accentDeep: '#C0341F',
      support: '#FFC24A',
      supportDeep: '#D2911A',
      panel: '#FDF6F3',
      cell: '#FFFFFF',
      highlight: '#FFF3DF',
    },
    fallbacks: { hero: '🧑‍🚒', cast: '🚒' },
  },
  {
    id: 'nature',
    name: 'טבע',
    emoji: '🌳',
    colors: {
      ground: '#E2F4DC',
      blobA: '#F4FBF0',
      blobB: '#BFE5B4',
      confetti: '#FFFFFF',
      ink: '#1E4A23',
      accent: '#4CA457',
      accentDeep: '#2F7539',
      support: '#F5B93C',
      supportDeep: '#C88C15',
      panel: '#F5FAF3',
      cell: '#FFFFFF',
      highlight: '#FEF6E0',
    },
    fallbacks: { hero: '🐿️', cast: '🦊' },
  },
  {
    id: 'space',
    name: 'חלל',
    emoji: '🚀',
    colors: {
      ground: '#E6E2FB',
      blobA: '#F5F3FF',
      blobB: '#C7BDF3',
      confetti: '#FFFFFF',
      ink: '#2A2065',
      accent: '#7059D6',
      accentDeep: '#4B37A3',
      support: '#34C7DE',
      supportDeep: '#1793AA',
      panel: '#F6F4FD',
      cell: '#FFFFFF',
      highlight: '#E3F8FC',
    },
    fallbacks: { hero: '👨‍🚀', cast: '🚀' },
  },
  {
    id: 'construction',
    name: 'כלי עבודה',
    emoji: '🚜',
    colors: {
      ground: '#FFEFD4',
      blobA: '#FFF9EC',
      blobB: '#FFD79A',
      confetti: '#FFFFFF',
      ink: '#553611',
      accent: '#F0952B',
      accentDeep: '#BF6D11',
      support: '#4FA8D8',
      supportDeep: '#2A7BA8',
      panel: '#FDF8F0',
      cell: '#FFFFFF',
      highlight: '#E6F4FC',
    },
    fallbacks: { hero: '👷', cast: '🚜' },
  },
  {
    id: 'football',
    name: 'כדורגל',
    emoji: '⚽',
    colors: {
      ground: '#DFF3E2',
      blobA: '#F3FBF4',
      blobB: '#B6E2BE',
      confetti: '#FFFFFF',
      ink: '#17402A',
      accent: '#3E9E62',
      accentDeep: '#26743F',
      support: '#4C8FE0',
      supportDeep: '#2A64AE',
      panel: '#F4FAF5',
      cell: '#FFFFFF',
      highlight: '#E7F1FD',
    },
    fallbacks: { hero: '⚽', cast: '🥅' },
  },
  {
    id: 'mickey',
    name: 'מיקי מאוס',
    emoji: '🐭',
    colors: {
      ground: '#FFE4E4',
      blobA: '#FFF6F6',
      blobB: '#FFBFC2',
      confetti: '#FFFFFF',
      ink: '#4E1620',
      accent: '#E24B55',
      accentDeep: '#B02733',
      support: '#FFC646',
      supportDeep: '#D0951A',
      panel: '#FDF6F6',
      cell: '#FFFFFF',
      highlight: '#FFF6E1',
    },
    fallbacks: { hero: '🐭', cast: '🦆' },
  },
  {
    id: 'underwater',
    name: 'עולם תת-ימי',
    emoji: '🐬',
    colors: {
      ground: '#D8F2F4',
      blobA: '#F0FBFC',
      blobB: '#A9E2E8',
      confetti: '#FFFFFF',
      ink: '#0D4450',
      accent: '#2AA3B5',
      accentDeep: '#14707F',
      support: '#FF9166',
      supportDeep: '#D1603A',
      panel: '#F2FAFB',
      cell: '#FFFFFF',
      highlight: '#FFEDE4',
    },
    fallbacks: { hero: '🐬', cast: '🐙' },
  },
  {
    id: 'cars',
    name: 'מכוניות',
    emoji: '🏎️',
    colors: {
      ground: '#FFE7DE',
      blobA: '#FFF7F3',
      blobB: '#FFC6B4',
      confetti: '#FFFFFF',
      ink: '#55201A',
      accent: '#E8503F',
      accentDeep: '#B62E20',
      support: '#F5B335',
      supportDeep: '#C68611',
      panel: '#FDF7F5',
      cell: '#FFFFFF',
      highlight: '#FEF4E0',
    },
    fallbacks: { hero: '🏎️', cast: '🚗' },
  },
  {
    id: 'super-wings',
    name: 'מטוסי על',
    emoji: '✈️',
    colors: {
      ground: '#DEEBFF',
      blobA: '#F3F8FF',
      blobB: '#B9D4FB',
      confetti: '#FFFFFF',
      ink: '#16325C',
      accent: '#3B76D8',
      accentDeep: '#22509F',
      support: '#F2604F',
      supportDeep: '#C63B2C',
      panel: '#F4F8FE',
      cell: '#FFFFFF',
      highlight: '#FFECE8',
    },
    fallbacks: { hero: '✈️', cast: '🛩️' },
  },
]

export const DEFAULT_THEME = THEMES[0]

export function getTheme(id) {
  return THEMES.find((theme) => theme.id === id) ?? DEFAULT_THEME
}

/**
 * The four artwork slots.
 *  background — full-bleed illustrated scene, printed at full strength
 *  frame      — an ornamental border, drawn over everything, hollow centre
 *  cast       — a vertical strip of characters; used on the right gutter and
 *               mirrored for the left, so one file dresses both sides
 *  hero       — the big character that stands beside the child's name
 */
export const ASSET_SLOTS = ['background', 'frame', 'cast', 'hero']

export function assetPath(themeId, slot) {
  return `${import.meta.env.BASE_URL}assets/${themeId}/${slot}.png`
}

/** Theme colors as the CSS custom properties the stylesheet reads. */
export function themeCssVars(theme) {
  const vars = {}
  for (const [key, value] of Object.entries(theme.colors)) {
    vars[`--c-${key}`] = value
  }
  return vars
}
