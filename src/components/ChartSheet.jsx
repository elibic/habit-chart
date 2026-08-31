import { useState } from 'react'
import AssetImage from './AssetImage'
import FloatingElement from './FloatingElement'
import { SunIcon, MoonIcon } from './Icons'
import { WEEKDAY_NAMES, WEEKDAY_SHORT } from '../lib/hebrewCalendar'
import { assetPath, themeCssVars } from '../lib/themes'
import { orderedIds } from '../lib/elements'
import { layoutCssVars } from '../lib/layout'

/**
 * The printable sheet — a poster, not a worksheet: illustrated background,
 * characters down both gutters, a gold frame over the top, and the calendar
 * as a white panel floating in the middle.
 *
 * Everything inside is laid out in real millimetres at the chosen paper size,
 * so the on-screen preview and the printed page are the same object; the
 * preview just wears a CSS transform.
 *
 * Strictly RTL: the grid's first column renders on the right, which puts
 * יום ראשון on the right and שבת on the left with no manual reordering.
 */
export default function ChartSheet({
  theme,
  layout,
  grid,
  settings,
  elements,
  selectedId,
  onSelect,
  onMove,
  editable = false,
}) {
  const stickers = Number(settings.stickersPerDay)
  const style = { ...themeCssVars(theme), ...layoutCssVars(layout) }
  const childName = settings.childName.trim()

  // Artwork comes in one of two shapes. Either four separate PNGs, or a single
  // full-page backdrop that already has the characters and the frame painted
  // into it — which is what an image generator hands back when you ask it for
  // one poster. In the second case the remaining slots have no file, and their
  // "art goes here" placeholders would sit on top of finished artwork, so once
  // a real background loads the placeholders stop being drawn. A real hero,
  // cast or frame PNG still renders either way.
  //
  // We remember which backdrop loaded rather than a bare flag: switching from
  // a theme that has artwork to one that doesn't has to bring the placeholders
  // back, and a flag would stay stuck on.
  const [backdropSrc, setBackdropSrc] = useState(null)
  const backdrop = assetPath(theme.id, 'background')
  const placeholder = backdropSrc === backdrop ? null : undefined

  return (
    <div className="chart-sheet" dir="rtl" lang="he" style={style}>
      {/* Full-bleed scene. Its CSS fallback — a ray-burst gradient painted on
          .chart-sheet itself — shows through while the PNG is missing. */}
      <AssetImage
        src={backdrop}
        className="deco deco--background"
        alt=""
        fallback={null}
        onLoad={() => setBackdropSrc(backdrop)}
      />

      <div className="sheet-inner">
        <header className="sheet-header" aria-hidden="true">
          <AssetImage
            src={assetPath(theme.id, 'hero')}
            className="deco deco--hero"
            fallbackGlyph={theme.fallbacks.hero}
            fallback={placeholder}
            alt=""
          />
        </header>

        <div className="sheet-body">
          {/* One artwork file dresses both gutters: the left copy is mirrored.
              The gutter is a element in its own right, so the margin survives
              even when nothing is drawn in it — otherwise a backdrop, whose
              characters live out here, gets covered by the panel. */}
          <div className="gutter">
            <AssetImage
              src={assetPath(theme.id, 'cast')}
              className="deco deco--cast"
              fallbackGlyph={theme.fallbacks.cast}
              fallback={placeholder}
              alt=""
            />
          </div>

          <div className="grid-panel">
            <div className="dow-row" role="row">
              {WEEKDAY_NAMES.map((name, index) => (
                <div
                  key={name}
                  className={`dow-cell${index === 6 ? ' dow-cell--shabbat' : ''}`}
                >
                  <span className="dow-cell__long">{name}</span>
                  <span className="dow-cell__short">{WEEKDAY_SHORT[index]}</span>
                </div>
              ))}
            </div>

            <div className="month-grid">
              {grid.cells.map((cell) =>
                cell.empty ? (
                  <div key={cell.key} className="day-cell day-cell--empty" />
                ) : (
                  <div
                    key={cell.key}
                    className={`day-cell${cell.isShabbat ? ' day-cell--shabbat' : ''}`}
                  >
                    <span className="day-cell__head">
                      {/* Hebrew letters only — never Arabic numerals. */}
                      <span className="day-cell__date">{cell.label}</span>
                      {/* A range can cross into a new month, where a bare
                          א׳ would be unreadable without its month. */}
                      {cell.monthLabel && (
                        <span className="day-cell__month">
                          {cell.monthLabel}
                        </span>
                      )}
                    </span>
                    <div
                      className={`sticker-row sticker-row--${stickers}`}
                      aria-label={`מקום למדבקות ליום ${cell.label}`}
                    >
                      {stickers === 2 ? (
                        <>
                          <StickerSlot kind="morning" />
                          <StickerSlot kind="evening" />
                        </>
                      ) : (
                        <StickerSlot kind="single" />
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="gutter">
            <AssetImage
              src={assetPath(theme.id, 'cast')}
              className="deco deco--cast deco--cast-flip"
              fallbackGlyph={theme.fallbacks.cast}
              fallback={placeholder}
              alt=""
            />
          </div>
        </div>

        <footer className="sheet-footer" aria-hidden="true" />
      </div>

      {/* Everything the parent can pick up and move. It sits above the grid
          but below the frame, and is positioned in percentages of the sheet
          so a layout arranged on A4 lands the same way on A3. */}
      <div className="overlay">
        {orderedIds(elements)
          .filter((id) => elements[id].kind === 'image')
          .map((id) => (
            <FloatingElement
              key={id}
              id={id}
              element={elements[id]}
              selected={selectedId === id}
              onSelect={onSelect}
              onMove={onMove}
              editable={editable}
              className={`sheet-image sheet-image--${elements[id].edge}`}
            >
              <img src={elements[id].src} alt="" draggable="false" />
            </FloatingElement>
          ))}

        <FloatingElement
          id="topic"
          element={elements.topic}
          selected={selectedId === 'topic'}
          onSelect={onSelect}
          onMove={onMove}
          editable={editable}
          className="topic-ribbon"
        >
          {settings.topic || 'הטבלה שלי'}
        </FloatingElement>

        <FloatingElement
          id="name"
          element={elements.name}
          selected={selectedId === 'name'}
          onSelect={onSelect}
          onMove={onMove}
          editable={editable}
          className="sheet-name"
        >
          {childName || 'השם שלי'}
        </FloatingElement>

        <FloatingElement
          id="dateChip"
          element={elements.dateChip}
          selected={selectedId === 'dateChip'}
          onSelect={onSelect}
          onMove={onMove}
          editable={editable}
          className="date-chip"
        >
          {grid.period.kind === 'range' ? (
            <>
              <span className="date-chip__row">
                <span className="date-chip__tag">מ־</span>
                {grid.period.from}
              </span>
              <span className="date-chip__row">
                <span className="date-chip__tag">עד</span>
                {grid.period.to}
              </span>
              <span className="date-chip__year">{grid.period.year}</span>
            </>
          ) : (
            <>
              <span className="date-chip__tag">חודש</span>
              <span className="date-chip__month">{grid.period.month}</span>
              <span className="date-chip__year">{grid.period.year}</span>
            </>
          )}
        </FloatingElement>

        <FloatingElement
          id="plaque"
          element={elements.plaque}
          selected={selectedId === 'plaque'}
          onSelect={onSelect}
          onMove={onMove}
          editable={editable}
          className="plaque"
        >
          <span className="plaque__star">★</span>
          <span className="plaque__text">{settings.plaqueText}</span>
          <span className="plaque__star">★</span>
        </FloatingElement>
      </div>

      {/* Drawn last, over everything: the ornamental border. */}
      {/* No CSS stand-in: an absent frame is simply absent, so the backdrop
          reaches the edge of the page. A real frame.png still draws. */}
      <AssetImage
        src={assetPath(theme.id, 'frame')}
        className="deco deco--frame"
        alt=""
        fallback={null}
      />
    </div>
  )
}

/** One empty white circle: the physical sticker lands here. */
function StickerSlot({ kind }) {
  return (
    <div className="sticker-slot">
      <div className="sticker-circle" />
      {kind !== 'single' && (
        <span className={`slot-label slot-label--${kind}`}>
          {kind === 'morning' ? (
            <SunIcon className="slot-label__icon" />
          ) : (
            <MoonIcon className="slot-label__icon" />
          )}
          {kind === 'morning' ? 'בוקר' : 'ערב'}
        </span>
      )}
    </div>
  )
}
