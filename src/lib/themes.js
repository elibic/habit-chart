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
