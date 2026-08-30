import { THEMES } from '../lib/themes'
import { PAPER_LIST } from '../lib/layout'
import { monthsOfYear, yearOptions } from '../lib/hebrewCalendar'
import { SunIcon, MoonIcon } from './Icons'

const field = 'flex flex-col gap-1.5'
const label = 'text-sm font-bold text-slate-700'
const input =
  'w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100'

/**
 * Everything the parent can change. Hidden entirely at print time by the
 * `no-print` class — see index.css.
 */
export default function ControlPanel({ settings, onChange, onPrint }) {
  const set = (key) => (event) => onChange({ [key]: event.target.value })

  const years = yearOptions()
  const months = monthsOfYear(Number(settings.year))

  return (
    <aside className="no-print w-full shrink-0 lg:w-80 xl:w-96">
      <div className="sticky top-6 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <header>
          <h1 className="text-xl font-black text-slate-900">
            מחולל טבלאות הרגלים
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            מלאו את הפרטים, בחרו עיצוב, והדפיסו טבלה חודשית למדבקות.
          </p>
        </header>

        <div className={field}>
          <label className={label} htmlFor="childName">
            שם הילד/ה
          </label>
          <input
            id="childName"
            className={input}
            type="text"
            value={settings.childName}
            onChange={set('childName')}
            placeholder="למשל: נועם"
            maxLength={28}
          />
        </div>

        <div className={field}>
          <label className={label} htmlFor="topic">
            שם הנושא / ההרגל
          </label>
          <input
            id="topic"
            className={input}
            type="text"
            value={settings.topic}
            onChange={set('topic')}
            placeholder="למשל: טבלת הצחצוח שלי"
            maxLength={40}
            list="topic-suggestions"
          />
          <datalist id="topic-suggestions">
            <option value="טבלת הצחצוח שלי" />
            <option value="טבלת סידור החדר" />
            <option value="התארגנות בוקר" />
          </datalist>
        </div>

        <fieldset className={field}>
          <legend className={label}>מדבקות ליום</legend>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {[
              { value: 1, title: 'מדבקה אחת', hint: 'עיגול אחד ליום' },
              { value: 2, title: 'שתי מדבקות', hint: 'בוקר וערב' },
            ].map((option) => {
              const active = Number(settings.stickersPerDay) === option.value
              return (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-xl border-2 p-3 text-center transition ${
                    active
                      ? 'border-sky-500 bg-sky-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="stickersPerDay"
                    className="sr-only"
                    value={option.value}
                    checked={active}
                    onChange={() => onChange({ stickersPerDay: option.value })}
                  />
                  <span className="flex items-center justify-center gap-1 text-slate-700">
                    {option.value === 2 ? (
                      <>
                        <SunIcon className="h-4 w-4 text-amber-500" />
                        <MoonIcon className="h-4 w-4 text-indigo-500" />
                      </>
                    ) : (
                      <span className="block h-4 w-4 rounded-full border-2 border-slate-400" />
                    )}
                  </span>
                  <span className="mt-1 block text-sm font-bold text-slate-800">
                    {option.title}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {option.hint}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <div className={field}>
            <label className={label} htmlFor="year">
              שנה עברית
            </label>
            <select
              id="year"
              className={input}
              value={settings.year}
              onChange={(event) => onChange({ year: Number(event.target.value) })}
            >
              {years.map((option) => (
                <option key={option.year} value={option.year}>
                  {option.label}
                  {option.leap ? ' (מעוברת)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={field}>
            <label className={label} htmlFor="month">
              חודש
            </label>
            <select
              id="month"
              className={input}
              value={settings.month}
              onChange={(event) =>
                onChange({ month: Number(event.target.value) })
              }
            >
              {months.map((option) => (
                <option key={option.month} value={option.month}>
                  {option.name} ({option.days} ימים)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={field}>
            <label className={label} htmlFor="paper">
              גודל דף
            </label>
            <select
              id="paper"
              className={input}
              value={settings.paperId}
              onChange={set('paperId')}
            >
              {PAPER_LIST.map((paper) => (
                <option key={paper.id} value={paper.id}>
                  {paper.label}
                </option>
              ))}
            </select>
          </div>

          <div className={field}>
            <label className={label} htmlFor="theme">
              ערכת עיצוב
            </label>
            <select
              id="theme"
              className={input}
              value={settings.themeId}
              onChange={set('themeId')}
            >
              {THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.emoji} {theme.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={onPrint}
          className="rounded-2xl bg-sky-600 px-4 py-3.5 text-lg font-black text-white shadow-lg shadow-sky-600/25 transition hover:bg-sky-700 active:scale-[0.99]"
        >
          🖨️ הדפסת הטבלה
        </button>

        <p className="rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
          <strong>טיפ להדפסה:</strong> בחלון ההדפסה סמנו «גרפיקת רקע» / «Background
          graphics», ובחרו לרוחב (Landscape) ובגודל{' '}
          <strong>{settings.paperId}</strong>.
        </p>
      </div>
    </aside>
  )
}
