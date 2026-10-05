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

// Shop quiz flow
await page.goto(BASE + '/quiz/shop', { waitUntil: 'networkidle' })
await page.screenshot({ path: OUT + '/quiz-shop-intro.png' })
await page.getByRole('button', { name: "Let's go →" }).click()
await page.waitForTimeout(300)

// Q1 multi: pick two, then Next
await page.getByRole('button', { name: 'Bookmarks' }).click()
await page.getByRole('button', { name: 'Keychains' }).click()
await page.getByRole('button', { name: 'Next →' }).click()
await page.waitForTimeout(300)

// Q2-Q6 single selects (tap advances automatically)
for (const label of [
  'One flat rate for everyone (most makers do this)',
  'Anywhere in the US',
  'Yes, that sounds great',
  'A little box at checkout where they type it',
  '5–15 orders sounds amazing',
]) {
  await page.getByRole('button', { name: label }).click()
  await page.waitForTimeout(500)
}

// Free text
await page.locator('textarea').fill('I would love gift wrapping options!')
await page.getByRole('button', { name: 'Next →' }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: OUT + '/quiz-shop-summary.png' })

// Copy button present
const copyBtn = await page.getByRole('button', { name: 'Copy my answers' }).count()
console.log('copy button present:', copyBtn === 1)

// ES toggle on summary
await page.getByRole('button', { name: 'Switch language' }).click()
await page.waitForTimeout(300)
await page.screenshot({ path: OUT + '/quiz-shop-summary-es.png' })

// Services quiz quick pass
await page.goto(BASE + '/quiz/services', { waitUntil: 'networkidle' })
await page.screenshot({ path: OUT + '/quiz-services-intro.png' })
await page.getByRole('button', { name: "Let's go →" }).click()
await page.waitForTimeout(300)
await page.getByRole('button', { name: "I do it, but it tires me out" }).click()
await page.waitForTimeout(500)

console.log('JS errors:', errors.length ? errors : 'none')
await browser.close()
