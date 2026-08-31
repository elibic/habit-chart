import { useEffect, useMemo, useState } from 'react'
import ControlPanel from './components/ControlPanel'
import ChartPreview from './components/ChartPreview'
import {
  buildMonthGrid,
  buildRangeGrid,
  currentHebrewMonth,
} from './lib/hebrewCalendar'
import { computeLayout } from './lib/layout'
import { getTheme } from './lib/themes'
import { defaultElements, ELEMENT_DEFS, newImageElement } from './lib/elements'
import { loadImageFile } from './lib/loadImage'
import { HDate } from '@hebcal/core'

const today = currentHebrewMonth()

const INITIAL_SETTINGS = {
  childName: '',
  topic: 'טבלת הצחצוח שלי',
  stickersPerDay: 1,
  paperId: 'A4',
  // 'month' fills one Hebrew month; 'range' runs a chosen number of weeks
  // from a chosen day, which is how a chart actually gets started — on the
  // day the parent decides, not on the 1st.
  mode: 'month',
  month: today.month,
  year: today.year,
  startDay: 1,
  weeks: 4,
  themeId: 'rescue-blue',
  plaqueText: 'כל הכבוד! ממשיכים ומצליחים',
}

export default function App() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS)
  const [elements, setElements] = useState(defaultElements)
  const [selectedId, setSelectedId] = useState(null)

  const update = (patch) => setSettings((prev) => ({ ...prev, ...patch }))

  const updateElement = (id, patch) =>
    setElements((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))

  const resetElement = (id) =>
    setElements((prev) =>
      ELEMENT_DEFS[id]
        ? { ...prev, [id]: { kind: 'text', ...ELEMENT_DEFS[id].defaults } }
        : prev,
    )

  const addImage = async (file) => {
    const src = await loadImageFile(file)
    const { id, element } = newImageElement(src)
    setElements((prev) => ({ ...prev, [id]: element }))
    setSelectedId(id)
  }

  const removeElement = (id) =>
    setElements((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

  // Adar II only exists in a leap year, so a year change can strand month 13
  // with no month for hebcal to describe. Resolved on the way out rather than
  // written back to state, which keeps the dropdown and the sheet in step.
  const month =
    settings.month === 13 && !HDate.isLeapYear(settings.year)
      ? 12
      : settings.month

  // A short month can strand a start day that a longer one allowed.
  const startDay = Math.min(
    settings.startDay,
    HDate.daysInMonth(month, settings.year),
  )

  const resolved = { ...settings, month, startDay }

  const theme = useMemo(() => getTheme(settings.themeId), [settings.themeId])

  const grid = useMemo(
    () =>
      settings.mode === 'range'
        ? buildRangeGrid({
            day: startDay,
            month,
            year: settings.year,
            weeks: Number(settings.weeks),
          })
        : buildMonthGrid(month, settings.year),
    [settings.mode, startDay, month, settings.year, settings.weeks],
  )

  const layout = useMemo(
    () =>
      computeLayout({
        paperId: settings.paperId,
        weeks: grid.weeks,
        stickersPerDay: Number(settings.stickersPerDay),
      }),
    [settings.paperId, settings.stickersPerDay, grid.weeks],
  )

  // `size` inside @page cannot read a CSS custom property, so the rule is
  // rewritten whenever the paper size changes.
  useEffect(() => {
    const id = 'dynamic-page-rule'
    const style =
      document.getElementById(id) ??
      document.head.appendChild(
        Object.assign(document.createElement('style'), { id }),
      )
    style.textContent = `@page { size: ${settings.paperId} landscape; margin: 0; }`
  }, [settings.paperId])

  return (
    <div className="app-shell" dir="rtl" lang="he">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 p-4 md:p-8 lg:flex-row lg:items-start">
        <ControlPanel
          settings={resolved}
          onChange={update}
          onPrint={() => window.print()}
          elements={elements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onElementChange={updateElement}
          onElementReset={resetElement}
          onAddImage={addImage}
          onRemoveElement={(id) => {
            removeElement(id)
            setSelectedId(null)
          }}
        />
        <ChartPreview
          theme={theme}
          layout={layout}
          grid={grid}
          settings={resolved}
          elements={elements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onMove={updateElement}
          editable
        />
      </div>
    </div>
  )
}
