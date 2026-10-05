import { chromium } from 'playwright-core'

const OUT = process.env.SHOT_DIR
const BASE = 'http://localhost:7109'

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()))

// 1. Home → navigate to store via the card link
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.getByText('Walk through the shop →').click()
await page.waitForURL('**/store')

// 2. Add two products to cart
await page.getByRole('button', { name: 'Add to cart' }).first().click()
await page.waitForTimeout(300)
await page.getByRole('button', { name: 'Add to cart' }).nth(1).click()
await page.waitForTimeout(300)

// 3. Open cart, verify contents, screenshot
await page.getByRole('button', { name: /Cart/ }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: OUT + '/flow-cart.png' })

// 4. Checkout
await page.getByRole('button', { name: 'Checkout' }).click()
await page.locator('input').first().fill('Demo Buyer')
await page.locator('input[type="email"]').fill('demo@example.com')
await page.screenshot({ path: OUT + '/flow-checkout.png' })
await page.getByRole('button', { name: 'Place demo order' }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: OUT + '/flow-success.png' })
await page.getByRole('button', { name: 'Keep browsing' }).click()

// 5. Category filter
await page.getByRole('button', { name: 'Bookmarks', exact: true }).click()
await page.waitForTimeout(300)
const bookmarkCount = await page.locator('article').count()
console.log('bookmarks shown:', bookmarkCount)

// 6. Language toggle to ES on store
await page.getByRole('button', { name: 'Switch language' }).first().click()
await page.waitForTimeout(300)
await page.screenshot({ path: OUT + '/flow-store-es.png', fullPage: false })

// 7. Showcase in ES
await page.goto(BASE + '/showcase', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Switch language' }).first().click()
await page.waitForTimeout(300)
await page.screenshot({ path: OUT + '/flow-showcase-es.png' })

console.log('JS errors:', errors.length ? errors : 'none')
await browser.close()
