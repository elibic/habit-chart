import { ELEMENT_DEFS, ELEMENT_IDS, STYLE_OPTIONS } from '../lib/elements'
import { FONT_OPTIONS } from '../lib/fonts'

const label = 'text-sm font-bold text-slate-700'
const input =
  'w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100'

/**
 * Properties for whichever element is selected on the sheet.
 *
 * Colour inputs sit beside a "back to theme" button rather than offering an
 * empty state, because `null` — follow the theme — is a value a colour picker
 * has no way to express.
 */
export default function ElementInspector({
  settings,
  onChange,
  elements,
  selectedId,
  onSelect,
  onElementChange,
  onElementReset,
}) {
  const def = selectedId ? ELEMENT_DEFS[selectedId] : null
  const el = selectedId ? elements[selectedId] : null

  return (
    <div className="no-print flex flex-col gap-3 rounded-2xl bg-slate-50 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className={label}>עיצוב הכותרות</span>
        <span className="text-xs text-slate-500">גררו אותן בתצוגה</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ELEMENT_IDS.map((id) => {
          const active = selectedId === id
          const hidden = !elements[id].visible
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(active ? null : id)}
              className={`rounded-xl border-2 px-2 py-2 text-right transition ${
                active
                  ? 'border-sky-500 bg-sky-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="block text-sm font-bold text-slate-800">
                {ELEMENT_DEFS[id].label}
              </span>
              <span className="block text-xs text-slate-500">
                {hidden ? 'מוסתר' : ELEMENT_DEFS[id].hint}
              </span>
            </button>
          )
        })}
      </div>

      {!el && (
        <p className="text-xs leading-relaxed text-slate-500">
          בחרו כותרת כדי לשנות את הטקסט, הגודל, הצבע והמיקום שלה. אפשר גם פשוט
          לגרור אותה בתצוגה המקדימה, או להזיז בחיצי המקלדת.
        </p>
      )}

      {el && (
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-3">
          {def.textKey && (
            <div className="flex flex-col gap-1.5">
              <label className={label} htmlFor="el-text">
                {def.textLabel}
              </label>
              <input
                id="el-text"
                className={input}
                type="text"
                value={settings[def.textKey]}
                onChange={(event) =>
                  onChange({ [def.textKey]: event.target.value })
                }
                maxLength={48}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="el-scale">
              גודל — {Math.round(el.scale * 100)}%
            </label>
            <input
              id="el-scale"
              type="range"
              min="0.4"
              max="2"
              step="0.05"
              value={el.scale}
              onChange={(event) =>
                onElementChange(selectedId, {
                  scale: Number(event.target.value),
                })
              }
              className="w-full accent-sky-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="el-rotate">
              הטיה — {el.rotate}°
            </label>
            <input
              id="el-rotate"
              type="range"
              min="-25"
              max="25"
              step="1"
              value={el.rotate}
              onChange={(event) =>
                onElementChange(selectedId, {
                  rotate: Number(event.target.value),
                })
              }
              className="w-full accent-sky-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="el-font">
              גופן
            </label>
            <select
              id="el-font"
              className={input}
              value={el.font}
              onChange={(event) =>
                onElementChange(selectedId, { font: event.target.value })
              }
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={label}>צורה</span>
            <div className="grid grid-cols-3 gap-2">
              {STYLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onElementChange(selectedId, { style: option.value })
                  }
                  className={`rounded-lg border-2 px-2 py-1.5 text-sm font-bold transition ${
                    el.style === option.value
                      ? 'border-sky-500 bg-sky-50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ColorField
              id="el-bg"
              text="צבע רקע"
              value={el.bg}
              fallback="#ffffff"
              onPick={(bg) => onElementChange(selectedId, { bg })}
            />
            <ColorField
              id="el-fg"
              text="צבע טקסט"
              value={el.fg}
              fallback="#1f2937"
              onPick={(fg) => onElementChange(selectedId, { fg })}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                onElementChange(selectedId, { visible: !el.visible })
              }
              className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300"
            >
              {el.visible ? 'הסתרה' : 'הצגה'}
            </button>
            <button
              type="button"
              onClick={() => onElementReset(selectedId)}
              className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300"
            >
              איפוס
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ColorField({ id, text, value, fallback, onPick }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={label} htmlFor={id}>
        {text}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value ?? fallback}
          onChange={(event) => onPick(event.target.value)}
          className="h-9 w-12 cursor-pointer rounded-lg border-2 border-slate-200 bg-white p-0.5"
        />
        <button
          type="button"
          onClick={() => onPick(null)}
          disabled={!value}
          className="flex-1 rounded-lg border-2 border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-600 transition enabled:hover:border-slate-300 disabled:opacity-40"
        >
          {value ? 'לפי הערכה' : 'ברירת מחדל'}
        </button>
      </div>
    </div>
  )
}
