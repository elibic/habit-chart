import { useState } from 'react'

/**
 * A decorative image that is allowed to not exist yet.
 *
 * The app ships with an empty /public/assets/ folder, so every artwork slot
 * has to survive a 404. On error we fall back to a soft coloured panel with
 * the theme's stand-in glyph, which keeps the sheet composed — and printable —
 * until the real PNGs are dropped in.
 *
 * We remember *which* src failed rather than a bare boolean, so switching
 * themes gives the new file its own chance to load without an effect.
 */
export default function AssetImage({
  src,
  alt = '',
  fallbackGlyph = '★',
  fallback,
  className = '',
  style,
  onLoad,
}) {
  const [failedSrc, setFailedSrc] = useState(null)

  if (failedSrc === src) {
    // `fallback={null}` means the slot has a CSS fallback underneath it and
    // should simply disappear — the full-bleed background works that way.
    if (fallback === null) return null
    return (
      <div
        className={`asset-fallback ${className}`}
        style={style}
        aria-hidden="true"
        title={alt}
      >
        <span className="asset-fallback__glyph">{fallbackGlyph}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailedSrc(src)}
      onLoad={onLoad}
      loading="eager"
      decoding="async"
    />
  )
}
