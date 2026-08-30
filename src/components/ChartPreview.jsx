import { useLayoutEffect, useRef, useState } from 'react'
import ChartSheet from './ChartSheet'
import { mmToPx } from '../lib/layout'

/**
 * Shows the sheet at its true printed size, shrunk to fit the screen.
 *
 * The sheet keeps its real millimetre dimensions and is scaled with a CSS
 * transform, so the preview cannot drift from the printout. The transform is
 * dropped again in @media print (see index.css).
 */
export default function ChartPreview(props) {
  const frameRef = useRef(null)
  const [scale, setScale] = useState(1)

  const sheetWidthPx = mmToPx(props.layout.paper.width)
  const sheetHeightPx = mmToPx(props.layout.paper.height)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const fit = () => {
      const available = frame.clientWidth
      if (available > 0) setScale(Math.min(1, available / sheetWidthPx))
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [sheetWidthPx])

  return (
    <div className="flex-1 min-w-0">
      <div
        className="no-print mb-3 flex items-baseline justify-between gap-3 text-sm text-slate-500"
        aria-hidden="true"
      >
        <span className="font-bold text-slate-700">תצוגה מקדימה</span>
        <span>
          {props.layout.paper.label} · לרוחב · {Math.round(scale * 100)}%
        </span>
      </div>

      <div ref={frameRef} className="print-frame">
        <div
          className="print-frame__scaler"
          style={{ height: `${sheetHeightPx * scale}px` }}
        >
          <div
            className="print-frame__sheet"
            style={{ transform: `scale(${scale})` }}
          >
            <ChartSheet {...props} />
          </div>
        </div>
      </div>
    </div>
  )
}
