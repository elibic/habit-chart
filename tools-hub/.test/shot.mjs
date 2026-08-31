import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
const ROOT = new URL('..', import.meta.url).pathname
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' }
const server = createServer(async (req, res) => {
  const p = join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html')
  try { const b = await readFile(p); res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'text/plain' }); res.end(b) }
  catch { res.writeHead(404).end('') }
})
await new Promise(r => server.listen(0, r))
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
for (const scheme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 900 }, colorScheme: scheme, deviceScaleFactor: 2 })
  await page.goto(`${base}/index.html`)
  await page.waitForSelector('.card')
  await page.waitForTimeout(400)
  await page.screenshot({ path: `/home/user/tools-site/.test/hub-${scheme}.png`, fullPage: true })
  await page.close()
}
const page = await browser.newPage({ viewport: { width: 1180, height: 1000 }, deviceScaleFactor: 2 })
await page.addInitScript(() => {
  const seed = { title: 'הכלים שלי', subtitle: 'כל מה שבניתי, במקום אחד', tools: [
    { id: 'a', name: 'טבלת הרגלים לילדים', icon: '⭐', url: 'https://elibic.github.io/habit-chart/', category: 'משפחה', status: 'live', tagline: 'מחולל טבלאות מדבקות להדפסה', description: 'ד' },
    { id: 'b', name: 'סדנת הקוביה של קובי', icon: '🧊', url: 'https://elibic.github.io/kubi-cube-workshop/', category: 'לימוד', status: 'live', tagline: 'מלמד ילד לפתור קוביה', description: 'ד' },
    { id: 'c', name: 'דף מבצע', icon: '🏷️', url: '', category: 'עבודה', status: 'wip', tagline: '', description: '' }] }
  const enc = s => btoa(String.fromCharCode(...new TextEncoder().encode(s)))
  window.fetch = async (url, opts = {}) => String(url).includes('api.github.com')
    ? new Response(JSON.stringify({ sha: 'x', content: enc(JSON.stringify(seed)) }), { status: 200 })
    : new Response('{}', { status: 200 })
})
await page.goto(`${base}/edit.html`)
await page.fill('#token', 'good')
await page.click('#login-btn')
await page.waitForSelector('#editor:not(.hidden)')
await page.locator('.item').nth(2).locator('.toggle').click()
await page.waitForTimeout(300)
await page.screenshot({ path: '/home/user/tools-site/.test/editor.png', fullPage: true })
await browser.close(); server.close()
console.log('shots done')
