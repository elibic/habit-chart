/**
 * Inline SVG, not an icon font or an image file: these two mark the morning
 * and evening sticker slots, and they have to survive both a missing
 * /public/assets/ folder and a black-and-white printer.
 */
export function SunIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="11.1"
          y="0.6"
          width="1.8"
          height="4"
          rx="0.9"
          fill="currentColor"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </svg>
  )
}

export function MoonIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M20.2 14.9A8.5 8.5 0 0 1 9.1 3.8a8.5 8.5 0 1 0 11.1 11.1Z"
        fill="currentColor"
      />
      <circle cx="17.4" cy="5.2" r="1.3" fill="currentColor" />
      <circle cx="20.6" cy="8.6" r="0.9" fill="currentColor" />
    </svg>
  )
}
