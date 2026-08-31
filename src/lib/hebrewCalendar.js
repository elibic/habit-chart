import { HDate, gematriya } from '@hebcal/core'

/**
 * All Hebrew-calendar knowledge lives here, on top of @hebcal/core.
 * @hebcal/core owns the hard parts: how long each month is (Cheshvan and
 * Kislev change length from year to year), which years are leap years and so
 * carry both Adar I and Adar II, and which weekday the 1st of a month lands
 * on. We only translate its answers into what the chart needs.
 */

/** Sunday-first, the way a Hebrew wall calendar reads. */
export const WEEKDAY_NAMES = [
  'יום ראשון',
  'יום שני',
  'יום שלישי',
  'יום רביעי',
  'יום חמישי',
  'יום שישי',
  'שבת',
]

export const WEEKDAY_SHORT = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']

/**
 * Hebrew names by hebcal's month number. 12 is plain Adar in a common year
 * and Adar I in a leap year, so it gets resolved per-year in monthNameHe().
 */
const MONTH_NAMES_HE = {
  1: 'ניסן',
  2: 'אייר',
  3: 'סיוון',
  4: 'תמוז',
  5: 'אב',
  6: 'אלול',
  7: 'תשרי',
  8: 'חשוון',
  9: 'כסלו',
  10: 'טבת',
  11: 'שבט',
  12: 'אדר',
  13: 'אדר ב׳',
}

export function monthNameHe(month, year) {
  if (month === 12 && HDate.isLeapYear(year)) return 'אדר א׳'
  return MONTH_NAMES_HE[month]
}

/**
 * The months of a Hebrew year in the order they are actually lived through:
 * Tishrei first, Elul last — not hebcal's Nisan-first numbering.
 */
export function monthsOfYear(year) {
  const order = HDate.isLeapYear(year)
    ? [7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4, 5, 6]
    : [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6]
  return order.map((month) => ({
    month,
    name: monthNameHe(month, year),
    days: HDate.daysInMonth(month, year),
  }))
}

/** A Hebrew year as letters, e.g. 5786 -> תשפ״ו. */
export function yearNameHe(year) {
  return gematriya(year % 1000)
}

/** A day of the month as letters only, e.g. 1 -> א׳, 15 -> ט״ו, 27 -> כ״ז. */
export function dayNameHe(day) {
  return gematriya(day)
}

/** Today, so the app opens on the month the parent is actually in. */
export function currentHebrewMonth() {
  const today = new HDate(new Date())
  return { month: today.getMonth(), year: today.getFullYear() }
}

/** A window of years around today, for the year dropdown. */
export function yearOptions(span = 3) {
  const { year } = currentHebrewMonth()
  const years = []
  for (let y = year - 1; y <= year + span; y++) {
    years.push({ year: y, label: yearNameHe(y), leap: HDate.isLeapYear(y) })
  }
  return years
}

/** One day, in the shape the grid renders. */
function dayCell(hd, index, opts = {}) {
  const day = hd.getDate()
  return {
    key: `day-${hd.abs()}`,
    empty: false,
    day,
    label: dayNameHe(day),
    dow: index % 7,
    isShabbat: index % 7 === 6,
    // Only in a range that crosses into a new month: the 1st carries the
    // month's name, otherwise א׳ appearing mid-chart is unreadable.
    monthLabel: opts.markMonths && day === 1 ? monthNameHe(hd.getMonth(), hd.getFullYear()) : null,
  }
}

/**
 * A run of whole weeks starting on a chosen date — a four-week chart begun on
 * י״ז אלול, say — rather than a calendar month. It rolls into the next month,
 * and into the next year, because @hebcal/core does the arithmetic.
 */
export function buildRangeGrid({ day, month, year, weeks }) {
  const start = new HDate(day, month, year)
  const startDow = start.getDay()
  const totalDays = weeks * 7 - startDow

  const cells = []
  for (let i = 0; i < startDow; i++) {
    cells.push({ key: `pad-${i}`, empty: true })
  }
  let hd = start
  for (let i = 0; i < totalDays; i++) {
    cells.push(dayCell(hd, startDow + i, { markMonths: true }))
    hd = hd.add(1, 'd')
  }
  const end = hd.add(-1, 'd')

  return {
    cells,
    weeks,
    totalDays,
    startDow,
    monthName: monthNameHe(start.getMonth(), start.getFullYear()),
    yearName: yearNameHe(start.getFullYear()),
    period: {
      kind: 'range',
      from: `${dayNameHe(start.getDate())} ${monthNameHe(start.getMonth(), start.getFullYear())}`,
      to: `${dayNameHe(end.getDate())} ${monthNameHe(end.getMonth(), end.getFullYear())}`,
      year:
        start.getFullYear() === end.getFullYear()
          ? yearNameHe(start.getFullYear())
          : `${yearNameHe(start.getFullYear())}–${yearNameHe(end.getFullYear())}`,
    },
  }
}

/**
 * The grid itself: a flat list of cells, padded at the front so that the 1st
 * of the month sits under its real weekday, and padded at the end so the last
 * week is a full row of seven.
 */
export function buildMonthGrid(month, year) {
  const totalDays = HDate.daysInMonth(month, year)
  const startDow = new HDate(1, month, year).getDay() // 0 = Sunday
  const weeks = Math.ceil((startDow + totalDays) / 7)

  const cells = []
  for (let i = 0; i < weeks * 7; i++) {
    const day = i - startDow + 1
    if (day < 1 || day > totalDays) {
      cells.push({ key: `pad-${i}`, empty: true })
    } else {
      cells.push(dayCell(new HDate(day, month, year), i))
    }
  }

  return {
    cells,
    weeks,
    totalDays,
    startDow,
    monthName: monthNameHe(month, year),
    yearName: yearNameHe(year),
    period: {
      kind: 'month',
      month: monthNameHe(month, year),
      year: yearNameHe(year),
    },
  }
}
