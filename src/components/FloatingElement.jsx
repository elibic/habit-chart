import { useRef } from 'react'
import { elementStyle } from '../lib/elements'

/**
 * One draggable element on the sheet.
 *
 * Dragging works in percentages of the sheet's own box, read from the live
 * bounding rect — so it behaves identically whether the preview is scaled to
 * 40% or 100%, and on A4 or A3, with no scale factor passed in.
 *
 * Pointer events, not mouse events: the same code then works under a finger.
 */
export default function FloatingElement({
  id,
  element,
  selected,
  onSelect,
  onMove,
  editable,
  className = '',
  children,
}) {
  const ref = useRef(null)
  const drag = useRef(null)

  if (!element.visible) return null

  const handlePointerDown = (event) => {
    if (!editable) return
    const sheet = ref.current?.closest('.chart-sheet')
    if (!sheet) return
    event.preventDefault()
    onSelect(id)
    const rect = sheet.getBoundingClientRect()
    drag.current = {
      rect,
      startX: event.clientX,
      startY: event.clientY,
      originX: element.x,
      originY: element.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const d = drag.current
    if (!d) return
    const clamp = (v) => Math.max(0, Math.min(100, v))
    onMove(id, {
      x: clamp(d.originX + ((event.clientX - d.startX) / d.rect.width) * 100),
      y: clamp(d.originY + ((event.clientY - d.startY) / d.rect.height) * 100),
    })
  }

  const endDrag = (event) => {
    if (!drag.current) return
    drag.current = null
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  // Arrow keys nudge by a tenth of the sheet's width per press — a mouse can't
  // land on an exact percentage and a printed page shows the difference.
  const handleKeyDown = (event) => {
    if (!editable) return
    const step = event.shiftKey ? 1 : 0.2
    const moves = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    onMove(id, {
      x: Math.max(0, Math.min(100, element.x + move[0])),
      y: Math.max(0, Math.min(100, element.y + move[1])),
    })
  }

  return (
    <div
      ref={ref}
      className={`floating floating--${element.style}${
        selected ? ' is-selected' : ''
      }${editable ? ' is-editable' : ''} ${className}`}
      style={elementStyle(element)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
      tabIndex={editable ? 0 : -1}
      role={editable ? 'button' : undefined}
      aria-label={editable ? `הזזת ${id}` : undefined}
    >
      {children}
    </div>
  )
}
