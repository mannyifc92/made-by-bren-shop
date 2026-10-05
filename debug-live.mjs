import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const logs = []
page.on('console', (m) => logs.push(m.type() + ': ' + m.text()))
page.on('pageerror', (e) => logs.push('pageerror: ' + e.message))
page.on('requestfailed', (r) => logs.push('reqfail: ' + r.url() + ' ' + (r.failure()?.errorText ?? '')))

for (const url of process.env.URLS.split(',')) {
  logs.push('--- ' + url)
  const resp = await page.goto(url, { waitUntil: 'networkidle' })
  logs.push('status: ' + resp?.status())
  await page.waitForTimeout(1500)
  const bodyText = (await page.locator('body').innerText()).slice(0, 200).replace(/\n/g, ' | ')
  logs.push('body: ' + bodyText)
  await page.screenshot({ path: process.env.SHOT_DIR + '/debug-' + url.split('/').filter(Boolean).pop() + '.png' })
}
console.log(logs.join('\n'))
await browser.close()
