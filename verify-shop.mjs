import { chromium } from 'playwright-core'

const OUT = process.env.SHOT_DIR
const BASE = 'http://localhost:4100'

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))

// Health check
const health = await (await page.request.get(BASE + '/api/health')).json()
console.log('health:', JSON.stringify(health))

// Store: add a personalized item + a normal item
await page.goto(BASE + '/store', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Add to cart' }).first().click() // fishy friend (personalized)
await page.waitForTimeout(300)
await page.getByRole('button', { name: 'Add to cart' }).nth(2).click() // nurse charm
await page.waitForTimeout(300)

// Cart → checkout
await page.getByRole('button', { name: /Cart/ }).click()
await page.waitForTimeout(300)
await page.getByRole('button', { name: 'Checkout' }).click()
await page.waitForTimeout(300)

// Choose pickup
await page.getByRole('button', { name: /Free pickup/ }).click()
await page.screenshot({ path: OUT + '/live-checkout-modal.png' })

// Personalization field visible for fishy friend?
const hasNote = await page.locator('input').count()
console.log('personalization inputs:', hasNote)
await page.locator('input').first().fill('SOFIA')

// Continue → mock checkout preview
await page.getByRole('button', { name: 'Continue to secure checkout →' }).click()
await page.waitForURL('**/checkout-preview**', { timeout: 10000 })
await page.waitForTimeout(400)
await page.screenshot({ path: OUT + '/live-checkout-preview.png' })
console.log('landed on:', page.url())

// API direct test: ship delivery with personalization note
const apiRes = await page.request.post(BASE + '/api/checkout', {
  data: { lines: [{ id: 'fishy-friend', qty: 2 }], delivery: 'ship', notes: { 'fishy-friend': 'SOFIA' } },
})
const apiBody = await apiRes.json()
console.log('api ship checkout:', apiRes.status(), JSON.stringify(apiBody))

// Bad product rejected
const bad = await page.request.post(BASE + '/api/checkout', {
  data: { lines: [{ id: 'hacked-item', qty: 1 }], delivery: 'ship' },
})
console.log('bad product rejected:', bad.status() === 400)

console.log('JS errors:', errors.length ? errors : 'none')
await browser.close()
