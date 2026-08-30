import AssetImage from './AssetImage'
import { SunIcon, MoonIcon } from './Icons'
import { WEEKDAY_NAMES, WEEKDAY_SHORT } from '../lib/hebrewCalendar'
import { assetPath, themeCssVars } from '../lib/themes'
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
export default function ChartSheet({ theme, layout, grid, settings }) {
  const stickers = Number(settings.stickersPerDay)
  const style = { ...themeCssVars(theme), ...layoutCssVars(layout) }
  const childName = settings.childName.trim()

  return (
    <div className="chart-sheet" dir="rtl" lang="he" style={style}>
      {/* Full-bleed scene. Its CSS fallback — a ray-burst gradient painted on
          .chart-sheet itself — shows through while the PNG is missing. */}
      <AssetImage
        src={assetPath(theme.id, 'background')}
        className="deco deco--background"
        alt=""
        fallback={null}
      />

      <div className="sheet-inner">
        <header className="sheet-header">
          <AssetImage
            src={assetPath(theme.id, 'hero')}
            className="deco deco--hero"
            fallbackGlyph={theme.fallbacks.hero}
            alt=""
          />
          <div className="sheet-header__titles">
            <p className="sheet-eyebrow">
              {settings.topic || 'הטבלה שלי'} — חודש {grid.monthName}{' '}
              {grid.yearName}
            </p>
            <h1 className="sheet-name">{childName || ' '}</h1>
          </div>
          {/* Balances the hero's width so the name is centred on the page
              and not on the space left over beside it. The top-left corner
              is filled by the background artwork. */}
          <div className="sheet-header__balance" aria-hidden="true" />
        </header>

        <div className="sheet-body">
          {/* One artwork file dresses both gutters: the left copy is mirrored. */}
          <AssetImage
            src={assetPath(theme.id, 'cast')}
            className="deco deco--cast"
            fallbackGlyph={theme.fallbacks.cast}
            alt=""
          />

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
                    {/* Hebrew letters only — never Arabic numerals. */}
                    <span className="day-cell__date">{cell.label}</span>
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

          <AssetImage
            src={assetPath(theme.id, 'cast')}
            className="deco deco--cast deco--cast-flip"
            fallbackGlyph={theme.fallbacks.cast}
            alt=""
          />
        </div>

        <footer className="sheet-footer">
          <div className="plaque">
            <span className="plaque__star">★</span>
            <span className="plaque__text">כל הכבוד! ממשיכים ומצליחים</span>
            <span className="plaque__star">★</span>
          </div>
        </footer>
      </div>

      {/* Drawn last, over everything: the ornamental border. */}
      <AssetImage
        src={assetPath(theme.id, 'frame')}
        className="deco deco--frame"
        fallbackGlyph={theme.fallbacks.frame}
        alt=""
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
