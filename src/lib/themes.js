/**
 * A theme is a palette plus a folder of artwork.
 *
 * The sheet is designed to look like a printed poster: a full-bleed
 * illustrated background, a cast of characters down both side gutters, a gold
 * frame over the lot, and the calendar itself as a white panel floating in the
 * middle. Four PNGs per theme carry all of that, and every one of them is
 * optional — see AssetImage and the CSS fallbacks in index.css.
 */
export const THEMES = [
  {
    id: 'rescue-blue',
    name: 'כחול הצלה',
    emoji: '🚓',
    colors: {
      scene: '#2f9ae0',
      sceneLight: '#8fd6ff',
      sceneDark: '#0b4f96',
      ink: '#0b2545',
      primary: '#1565c0',
      primaryDark: '#0d3f8f',
      accent: '#ffc21f',
      accentDark: '#d98f00',
      panel: '#ffffff',
      cell: '#ffffff',
      grid: '#a9c8ea',
      shabbat: '#eaf3ff',
      nameFill: '#1f66cf',
      nameStroke: '#ffffff',
      nameShadow: '#082a5e',
      eyebrowFill: '#ffffff',
      eyebrowStroke: '#12457f',
      plaque: '#0d3f8f',
    },
    fallbacks: { hero: '👮', cast: '🚑', frame: '🔵' },
  },
  {
    id: 'fire-red',
    name: 'אדום כבאית',
    emoji: '🚒',
    colors: {
      scene: '#e8613c',
      sceneLight: '#ffc196',
      sceneDark: '#9c2412',
      ink: '#4a1008',
      primary: '#d32f2f',
      primaryDark: '#a01a1a',
      accent: '#ffb300',
      accentDark: '#e07b00',
      panel: '#ffffff',
      cell: '#ffffff',
      grid: '#efb3a6',
      shabbat: '#fff0ea',
      nameFill: '#d32f2f',
      nameStroke: '#ffffff',
      nameShadow: '#5e1006',
      eyebrowFill: '#fff3d6',
      eyebrowStroke: '#8f1c0c',
      plaque: '#a01a1a',
    },
    fallbacks: { hero: '🧑‍🚒', cast: '🚒', frame: '🔴' },
  },
  {
    id: 'nature',
    name: 'טבע',
    emoji: '🌳',
    colors: {
      scene: '#5fb85f',
      sceneLight: '#c8f0a8',
      sceneDark: '#1f6b2c',
      ink: '#14401c',
      primary: '#2e7d32',
      primaryDark: '#1b5e20',
      accent: '#f9b429',
      accentDark: '#d18a00',
      panel: '#ffffff',
      cell: '#ffffff',
      grid: '#b3d9b6',
      shabbat: '#eefaea',
      nameFill: '#2e7d32',
      nameStroke: '#ffffff',
      nameShadow: '#0d3b14',
      eyebrowFill: '#fdf6dd',
      eyebrowStroke: '#1b5e20',
      plaque: '#1b5e20',
    },
    fallbacks: { hero: '🐿️', cast: '🦊', frame: '🍃' },
  },
  {
    id: 'space',
    name: 'חלל',
    emoji: '🚀',
    colors: {
      scene: '#4a37a8',
      sceneLight: '#9d8bf0',
      sceneDark: '#180d42',
      ink: '#1b1147',
      primary: '#5e35b1',
      primaryDark: '#3d1f80',
      accent: '#22d3ee',
      accentDark: '#0e91a8',
      panel: '#ffffff',
      cell: '#ffffff',
      grid: '#c3b6e8',
      shabbat: '#f1edff',
      nameFill: '#5e35b1',
      nameStroke: '#ffffff',
      nameShadow: '#150a3d',
      eyebrowFill: '#e6fbff',
      eyebrowStroke: '#3d1f80',
      plaque: '#3d1f80',
    },
    fallbacks: { hero: '👨‍🚀', cast: '🚀', frame: '⭐' },
  },
  {
    id: 'construction',
    name: 'כלי עבודה',
    emoji: '🚜',
    colors: {
      scene: '#4ea8e0',
      sceneLight: '#b8e4ff',
      sceneDark: '#1c5f96',
      ink: '#3d2c00',
      primary: '#e08600',
      primaryDark: '#a85f00',
      accent: '#ffd23f',
      accentDark: '#c99700',
      panel: '#ffffff',
      cell: '#ffffff',
      grid: '#e2c894',
      shabbat: '#fff7e3',
      nameFill: '#e08600',
      nameStroke: '#ffffff',
      nameShadow: '#5a3a00',
      eyebrowFill: '#fff8e1',
      eyebrowStroke: '#8a5200',
      plaque: '#a85f00',
    },
    fallbacks: { hero: '👷', cast: '🚜', frame: '🟠' },
  },
  {
    id: 'football',
    name: 'כדורגל',
    emoji: '⚽',
    colors: {
      scene: '#57b04f',
      sceneLight: '#b6e89c',
      sceneDark: '#1b5c25',
      ink: '#123d18',
      primary: '#1e7a32',
      primaryDark: '#0f4d1e',
      accent: '#ffd23f',
      accentDark: '#c99700',
      panel: '#ffffff',
      cell: '#ffffff',
      grid: '#a8cfa8',
      shabbat: '#eef8ea',
      nameFill: '#1e7a32',
      nameStroke: '#ffffff',
      nameShadow: '#0b3d14',
      eyebrowFill: '#ffffff',
      eyebrowStroke: '#14561f',
      plaque: '#0f4d1e',
    },
    fallbacks: { hero: '⚽', cast: '🥅', frame: '🟢' },
  },
  {
    id: 'mickey',
    name: 'מיקי מאוס',
    emoji: '🐭',
    colors: {
      scene: '#3fa0e8',
      sceneLight: '#b9e3ff',
      sceneDark: '#12508f',
      ink: '#2a1010',
      primary: '#d42a2a',
      primaryDark: '#9e1414',
      accent: '#ffd23f',
      accentDark: '#c99700',
      panel: '#ffffff',
      cell: '#ffffff',
      grid: '#efb1b1',
      shabbat: '#fff0f0',
      nameFill: '#d42a2a',
      nameStroke: '#ffffff',
      nameShadow: '#4a0d0d',
      eyebrowFill: '#fffbe6',
      eyebrowStroke: '#9e1414',
      plaque: '#9e1414',
    },
    fallbacks: { hero: '🐭', cast: '🦆', frame: '🔴' },
  },
  {
    id: 'underwater',
    name: 'עולם תת-ימי',
    emoji: '🐬',
    colors: {
      scene: '#1e9fb5',
      sceneLight: '#8fe6ee',
      sceneDark: '#0a4f63',
      ink: '#06333f',
      primary: '#0e7e94',
      primaryDark: '#065064',
      accent: '#ff8a5c',
      accentDark: '#d15a2c',
      panel: '#ffffff',
      cell: '#ffffff',
      grid: '#9fd6de',
      shabbat: '#e6f8fa',
      nameFill: '#0e7e94',
      nameStroke: '#ffffff',
      nameShadow: '#03303c',
      eyebrowFill: '#fff2e8',
      eyebrowStroke: '#065064',
      plaque: '#065064',
    },
    fallbacks: { hero: '🐬', cast: '🐙', frame: '🐚' },
  },
  {
    id: 'cars',
    name: 'מכוניות',
    emoji: '🏎️',
    colors: {
      scene: '#5aa8d8',
      sceneLight: '#c3e6ff',
      sceneDark: '#1b5580',
      ink: '#2b1206',
      primary: '#d81f26',
      primaryDark: '#9b0f14',
      accent: '#ffc21f',
      accentDark: '#d18f00',
      panel: '#ffffff',
      cell: '#ffffff',
      grid: '#eeb4a6',
      shabbat: '#fff1ec',
      nameFill: '#d81f26',
      nameStroke: '#ffffff',
      nameShadow: '#4d0a0d',
      eyebrowFill: '#fff8e1',
      eyebrowStroke: '#9b0f14',
      plaque: '#9b0f14',
    },
    fallbacks: { hero: '🏎️', cast: '🚗', frame: '🏁' },
  },
  {
    id: 'super-wings',
    name: 'מטוסי על',
    emoji: '✈️',
    colors: {
      scene: '#3f9ee0',
      sceneLight: '#bde5ff',
      sceneDark: '#14568e',
      ink: '#0d2a47',
      primary: '#1f5fbf',
      primaryDark: '#123f85',
      accent: '#e63b3b',
      accentDark: '#b31f1f',
      panel: '#ffffff',
      cell: '#ffffff',
      grid: '#a9c8ea',
      shabbat: '#eef4ff',
      nameFill: '#1f5fbf',
      nameStroke: '#ffffff',
      nameShadow: '#0a2a55',
      eyebrowFill: '#ffffff',
      eyebrowStroke: '#b31f1f',
      plaque: '#123f85',
    },
    fallbacks: { hero: '✈️', cast: '🛩️', frame: '🔵' },
  },
]

export const DEFAULT_THEME = THEMES[0]

export function getTheme(id) {
  return THEMES.find((theme) => theme.id === id) ?? DEFAULT_THEME
}

/**
 * The four artwork slots.
 *  background — full-bleed illustrated scene, printed at full strength
 *  frame      — gold ornamental border, drawn over everything, hollow centre
 *  cast       — a vertical strip of characters; used on the right gutter and
 *               mirrored for the left, so one file dresses both sides
 *  hero       — the big character that stands beside the child's name
 */
export const ASSET_SLOTS = ['background', 'frame', 'cast', 'hero']

/**
 * Base-relative, not root-absolute: the built site is served from a
 * subdirectory on GitHub Pages, where a leading `/` would point outside it.
 */
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
