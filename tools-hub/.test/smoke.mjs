// Drives both pages in a real browser: the hub against the published JSON, and
// the editor against a stubbed GitHub API, so the load → edit → save round trip
// is exercised without a real token.
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' }

const server = createServer(async (req, res) => {
  const path = join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html')
  try {
    const body = await readFile(path)
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'text/plain' })
    res.end(body)
  } catch {
    res.writeHead(404).end('nope')
  }
})
await new Promise(r => server.listen(0, r))
const base = `http://127.0.0.1:${server.address().port}`

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const page = await browser.newPage()
const fails = []
const check = (name, ok, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`)
  if (!ok) fails.push(name)
}
page.on('pageerror', e => fails.push('pageerror: ' + e.message))

// ── the hub ────────────────────────────────────────────────────────────
// api.github.com is unreachable from here, which is precisely the fallback path.
await page.goto(`${base}/index.html`)
await page.waitForSelector('.card', { timeout: 10000 })
check('hub renders every seeded tool', await page.locator('.card').count() === 4)
check('a tool with no url is not a link', await page.locator('div.card.is-wip').count() === 1)
check('a live tool links out', await page.locator('a.card[href^="https://elibic.github.io"]').count() === 3)

await page.fill('#search', 'קוביה')
await page.waitForFunction(() => document.querySelectorAll('.card').length === 1)
check('search narrows the grid', await page.locator('.card h2').innerText() === 'סדנת הקוביה של קובי')
await page.fill('#search', '')
await page.waitForFunction(() => document.querySelectorAll('.card').length === 4)

await page.getByRole('button', { name: 'משחקים' }).click()
await page.waitForFunction(() => document.querySelectorAll('.card').length === 1)
check('category chip filters', (await page.locator('.card h2').innerText()) === 'מונופול')

// ── the editor ─────────────────────────────────────────────────────────
let putBody = null
await page.addInitScript(() => {
  const seed = {
    title: 'הכלים שלי', subtitle: 'כל מה שבניתי',
    tools: [{ id: 'a', name: 'מונופול', icon: '🎩', url: 'https://example.com', category: 'משחקים', status: 'live', description: 'ד', tagline: 'ט' }],
  }
  const enc = s => btoa(String.fromCharCode(...new TextEncoder().encode(s)))
  window.__put = null
  window.fetch = async (url, opts = {}) => {
    if (!String(url).includes('api.github.com')) return new Response('{}', { status: 200 })
    if (!opts.method || opts.method === 'GET') {
      if (!String(opts.headers?.Authorization || '').includes('good-token')) {
        return new Response(JSON.stringify({ message: 'Not Found' }), { status: 404 })
      }
      return new Response(JSON.stringify({ sha: 'sha1', content: enc(JSON.stringify(seed)) }), { status: 200 })
    }
    window.__put = JSON.parse(opts.body)
    return new Response(JSON.stringify({ content: { sha: 'sha2' } }), { status: 200 })
  }
})

await page.goto(`${base}/edit.html`)
await page.fill('#token', 'bad-token')
await page.click('#login-btn')
await page.waitForSelector('#login-status.err')
check('a token without access is rejected', (await page.innerText('#login-status')).includes('Contents'))

await page.fill('#token', 'good-token')
await page.click('#login-btn')
await page.waitForSelector('#editor:not(.hidden)')
check('login loads the existing list', await page.locator('.item').count() === 1)
check('page title is loaded into the form', await page.inputValue('#page-title') === 'הכלים שלי')

await page.click('#add-btn')
check('adding a tool appends a row', await page.locator('.item').count() === 2)
const body = page.locator('.item').nth(1)
await body.locator('input[type="text"]').nth(1).fill('דף מבצע')
await body.locator('input[type="url"]').first().fill('https://example.com/mivtza')
await body.locator('input[type="text"]').nth(2).fill('המבצע של החודש')
check('the collapsed row follows the name', (await body.locator('.name').innerText()).includes('דף מבצע'))
check('unsaved changes are announced', (await page.innerText('#save-status')).includes('לא נשמרו'))

await page.locator('.item').nth(1).getByTitle('למעלה').click()
check('reordering moves the tool up', (await page.locator('.item').first().locator('.name').innerText()).includes('דף מבצע'))

await page.click('#save-btn')
await page.waitForSelector('#save-status.ok')
putBody = await page.evaluate(() => window.__put)
const saved = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(putBody.content), c => c.charCodeAt(0))))
check('the save commits against the loaded sha', putBody.sha === 'sha1')
check('the commit carries both tools in the new order', saved.tools.length === 2 && saved.tools[0].name === 'דף מבצע')
check('hebrew survives the base64 round trip', saved.tools[0].tagline === 'המבצע של החודש')
check('nothing is left marked dirty', (await page.innerText('#save-status')).includes('נשמר'))

await browser.close()
server.close()
console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nall green')
process.exit(fails.length ? 1 : 0)
