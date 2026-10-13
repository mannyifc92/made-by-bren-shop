// Made by Bren — production shop server
// Serves the built frontend and creates Stripe Checkout Sessions.
// If STRIPE_SECRET_KEY is not set, runs in MOCK mode: the checkout flow works
// end to end but redirects to a local preview page instead of Stripe.
//
// Digital products: orders that are all digital skip shipping entirely, and
// buyers get their download link(s) on the order-success page. The success
// page calls /api/order-lookup with the Stripe session id to fetch them.

import express from 'express'
import { readFileSync, writeFileSync, renameSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CATALOG_PATH = process.env.CATALOG_PATH || join(__dirname, 'catalog.json')

// Live catalog: re-read when the file on disk changes (CoreOps portal writes
// it via a mounted volume). On a parse error keep serving the last good
// catalog — the shop never goes down because of a bad write.
let catalogCache = null
let catalogStamp = null
const loadCatalog = () => {
  const data = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'))
  if (!Array.isArray(data)) throw new Error('catalog is not an array')
  return data
}
const getCatalog = () => {
  try {
    const st = statSync(CATALOG_PATH)
    const stamp = `${st.mtimeMs}:${st.size}`
    if (!catalogCache || stamp !== catalogStamp) {
      catalogCache = loadCatalog()
      catalogStamp = stamp
      console.log(`catalog loaded: ${catalogCache.length} products (${stamp})`)
    }
  } catch (err) {
    if (catalogCache) {
      console.error('catalog reload failed, serving last good copy:', err.message)
    } else {
      throw err // never booted with a good catalog — fail loudly
    }
  }
  return catalogCache
}
// Boot fails loudly if the catalog is missing/invalid (e.g. forgotten volume mount).
getCatalog()

// What the storefront renders: hidden products are not public. Sold-out
// (stock === 0) products ARE public — the UI shows them with an Agotado
// badge and checkout refuses them; demand stays visible.
const visibleCatalog = () => getCatalog().filter((p) => !p.hidden)

// Stock decrement (CoreOps §29.8): once per PAID Stripe session, recorded in
// processed-orders.json next to the catalog so a success-page refresh never
// double-counts. Whole-file atomic write (tmp + rename), same discipline as
// the portal's provider; a cross-process clobber would be caught by the
// provider's verify-after-write on its next edit.
const PROCESSED_PATH = join(dirname(CATALOG_PATH), 'processed-orders.json')
const writeJsonAtomic = (path, data) => {
  const tmp = `${path}.tmp-${process.pid}-${Date.now()}`
  writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n')
  renameSync(tmp, path)
}
const loadProcessed = () => {
  try {
    const data = JSON.parse(readFileSync(PROCESSED_PATH, 'utf8'))
    return typeof data === 'object' && data !== null && !Array.isArray(data) ? data : {}
  } catch {
    return {}
  }
}
const LOW_STOCK_THRESHOLD = Number(process.env.LOW_STOCK_THRESHOLD || 2)
const DISCORD_ALERT_WEBHOOK_URL = process.env.DISCORD_ALERT_WEBHOOK_URL || ''
const decrementStock = (sessionId, items) => {
  const processed = loadProcessed()
  if (processed[sessionId]) return false
  const catalog = loadCatalog() // fresh from disk, never the cache
  let changed = false
  const lowStock = []
  for (const { id, qty } of items) {
    const p = catalog.find((x) => x.id === id)
    if (p && typeof p.stock === 'number') {
      const before = p.stock
      p.stock = Math.max(0, p.stock - Math.max(1, qty || 1))
      changed = true
      // Low-stock alert fires on the downward crossing only, so a portal
      // restock above the threshold re-arms it naturally.
      if (before > LOW_STOCK_THRESHOLD && p.stock <= LOW_STOCK_THRESHOLD) {
        lowStock.push({ name: p.name?.en || id, left: p.stock })
      }
    }
  }
  if (changed) {
    writeJsonAtomic(CATALOG_PATH, catalog)
    catalogCache = null // force reload on next read
    console.log(`stock decremented for order ${sessionId}`)
  }
  processed[sessionId] = new Date().toISOString()
  writeJsonAtomic(PROCESSED_PATH, processed)
  // Fire-and-forget: alerting must never fail the order path.
  if (lowStock.length && DISCORD_ALERT_WEBHOOK_URL) {
    const lines = lowStock.map((l) => `• ${l.name}: ${l.left} left`).join('\n')
    fetch(DISCORD_ALERT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        content: `🧵 **Made by Bren — low stock** (order ${sessionId})\n${lines}\nTime to make more or restock in the portal.`,
      }),
      signal: AbortSignal.timeout(5000),
    }).catch((err) => console.error('low-stock alert failed:', err.message))
  }
  return true
}

// Site copy overrides (CoreOps portal writes content.json via a mounted
// volume). Shape: { "i18n.key": { "en": "...", "es": "..." } } — sparse:
// only the strings Brenda has edited. A missing file is NOT an error (the
// bundled defaults are the site copy); an unreadable/corrupt file serves the
// last good overrides.
const CONTENT_PATH = process.env.CONTENT_PATH || join(__dirname, 'content.json')
let contentCache = {}
let contentStamp = null
const getContent = () => {
  try {
    const st = statSync(CONTENT_PATH)
    const stamp = `${st.mtimeMs}:${st.size}`
    if (stamp !== contentStamp) {
      const data = JSON.parse(readFileSync(CONTENT_PATH, 'utf8'))
      if (typeof data !== 'object' || data === null || Array.isArray(data)) throw new Error('content is not an object')
      contentCache = data
      contentStamp = stamp
      console.log(`content overrides loaded: ${Object.keys(data).length} keys (${stamp})`)
    }
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('content reload failed, serving last good copy:', err.message)
  }
  return contentCache
}

const PORT = process.env.PORT || 4100
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || ''
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`
const FLAT_SHIPPING_CENTS = Number(process.env.FLAT_SHIPPING_CENTS || 500) // Brenda sets the real amount
const MOCK = !STRIPE_KEY

let stripe = null
if (!MOCK) {
  const { default: Stripe } = await import('stripe')
  stripe = new Stripe(STRIPE_KEY)
}

const app = express()

// Stripe webhook — registered BEFORE express.json() because signature
// verification needs the raw request body.
// Stripe → here → n8n → SMS/Discord. Stock decrement also lives here so it
// happens even if the buyer closes the tab before the success page loads
// (order-lookup keeps its call as the idempotent fallback, §29.8).
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || ''
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (MOCK || !WEBHOOK_SECRET) return res.status(400).json({ error: 'webhook not configured' })
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'] || '', WEBHOOK_SECRET)
  } catch (err) {
    console.error('webhook signature rejected:', err.message)
    return res.status(400).json({ error: 'bad signature' })
  }
  if (event.type === 'checkout.session.completed') {
    try {
      const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
        expand: ['line_items.data.price.product'],
      })
      if (session.payment_status === 'paid') {
        const items = (session.line_items?.data || [])
          .map((li) => ({
            id: li.price?.product?.metadata?.productId,
            name: li.price?.product?.name || li.description,
            qty: li.quantity || 1,
          }))
          .filter((l) => l.id)
        decrementStock(session.id, items)
        // Fire-and-forget: a notification failure must never fail Stripe's
        // webhook (Stripe retries on non-2xx and we'd double-decrement risk
        // is covered by idempotency, but noise is avoidable).
        if (N8N_WEBHOOK_URL) {
          const payload = {
            session_id: session.id,
            items: items.map(({ name, qty }) => ({ name, qty })),
            total: (session.amount_total || 0) / 100,
            currency: session.currency || 'usd',
            delivery: session.metadata?.delivery || '',
            personalization: session.metadata?.personalization || '',
          }
          fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(5000),
          }).catch((err) => console.error('n8n notify failed:', err.message))
        }
      }
    } catch (err) {
      console.error('webhook handling error:', err)
    }
  }
  res.json({ received: true })
})

app.use(express.json())

const digitalDownloads = (items) =>
  items
    .filter((p) => p.digital && p.download)
    .map((p) => ({ name: p.name.en, download: p.download }))

app.post('/api/checkout', async (req, res) => {
  try {
    const { lines, delivery, notes } = req.body || {}
    if (!Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ error: 'empty cart' })
    }
    if (!['ship', 'pickup', 'digital'].includes(delivery)) {
      return res.status(400).json({ error: 'invalid delivery method' })
    }

    // Server-side catalog is the price source of truth — never trust client prices.
    const lineItems = []
    const purchased = []
    const personalization = []
    for (const line of lines) {
      const product = getCatalog().find((p) => p.id === line.id)
      const qty = Math.max(1, Math.min(99, Number(line.qty) || 1))
      if (!product || product.hidden) return res.status(400).json({ error: `unknown product: ${line.id}` })
      // Tracked stock: refuse what we don't have (§29.8). Untracked products
      // (no stock field) are always available.
      if (typeof product.stock === 'number' && product.stock < qty) {
        return res.status(400).json({ error: `sold out: ${product.name.en}`, id: product.id })
      }

      let variant = null
      if (product.variants) {
        variant = product.variants.find((v) => v.id === line.variant)
        if (!variant) return res.status(400).json({ error: `unknown variant for ${line.id}` })
      }

      purchased.push(product)
      lineItems.push({
        quantity: qty,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round((variant?.price ?? product.price) * 100),
          product_data: {
            name: variant ? `${product.name.en} — ${variant.label.en.split('—')[0].trim()}` : product.name.en,
            metadata: { productId: product.id, variant: variant?.id || '' },
          },
        },
      })
      const note = (notes?.[variant ? `${product.id}|${variant.id}` : product.id] || '').toString().trim().slice(0, 200)
      if (product.personalized && note) {
        personalization.push(`${product.name.en}: ${note}`)
      }
    }

    const allDigital = purchased.every((p) => p.digital)
    const effectiveDelivery = allDigital ? 'digital' : delivery

    if (MOCK) {
      const total = lineItems.reduce((s, li) => s + li.price_data.unit_amount * li.quantity, 0)
      const shipping = effectiveDelivery === 'ship' ? FLAT_SHIPPING_CENTS : 0
      const params = new URLSearchParams({
        total: ((total + shipping) / 100).toFixed(2),
        delivery: effectiveDelivery,
        items: String(lineItems.reduce((s, li) => s + li.quantity, 0)),
      })
      if (purchased.some((p) => p.digital)) params.set('digital', '1')
      return res.json({ url: `${BASE_URL}/checkout-preview?${params}` })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${BASE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/store`,
      // All-digital orders: no address, no shipping — buyer downloads on the success page.
      shipping_address_collection:
        effectiveDelivery === 'ship' ? { allowed_countries: ['US'] } : undefined,
      shipping_options:
        effectiveDelivery === 'pickup'
          ? [
              {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: { amount: 0, currency: 'usd' },
                  display_name: 'Free pickup at the farmers market',
                },
              },
            ]
          : effectiveDelivery === 'ship'
            ? [
                {
                  shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: FLAT_SHIPPING_CENTS, currency: 'usd' },
                    display_name: 'Flat-rate shipping (US)',
                    delivery_estimate: {
                      minimum: { unit: 'business_day', value: 3 },
                      maximum: { unit: 'business_day', value: 7 },
                    },
                  },
                },
              ]
            : undefined,
      metadata: {
        delivery: effectiveDelivery,
        personalization: personalization.join(' | ').slice(0, 500),
      },
      payment_intent_data: {
        metadata: { delivery: effectiveDelivery, personalization: personalization.join(' | ').slice(0, 500) },
      },
    })
    res.json({ url: session.url })
  } catch (err) {
    console.error('checkout error:', err)
    res.status(500).json({ error: 'checkout failed' })
  }
})

// The success page calls this with the Checkout Session id to get download
// links for any digital products in the order.
app.get('/api/order-lookup', async (req, res) => {
  try {
    if (MOCK) {
      // Demo mode: show every digital product so the flow can be previewed.
      return res.json({ downloads: digitalDownloads(getCatalog()) })
    }
    const sessionId = String(req.query.session_id || '')
    if (!sessionId.startsWith('cs_')) return res.status(400).json({ error: 'bad session id' })

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product'],
    })
    if (session.payment_status !== 'paid') return res.status(402).json({ error: 'not paid' })

    const ids = (session.line_items?.data || [])
      .map((li) => ({
        id: li.price?.product?.metadata?.productId,
        qty: li.quantity || 1,
      }))
      .filter((l) => l.id)
    // Stock goes down exactly once per paid order (idempotent by session id).
    decrementStock(sessionId, ids)
    const downloads = digitalDownloads(getCatalog().filter((p) => ids.some((l) => l.id === p.id)))
    res.json({ downloads })
  } catch (err) {
    console.error('order-lookup error:', err)
    res.status(500).json({ error: 'lookup failed' })
  }
})

// The storefront's live product list — exactly what the site renders.
// Hidden products are not public and never leave this process.
app.get('/api/catalog', (_req, res) => {
  try {
    res.json(visibleCatalog())
  } catch (err) {
    console.error('catalog error:', err)
    res.status(500).json({ error: 'catalog unavailable' })
  }
})

// Site copy overrides — sparse map of i18n keys Brenda has edited.
app.get('/api/content', (_req, res) => {
  res.json(getContent())
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mode: MOCK ? 'mock' : 'stripe', products: getCatalog().length })
})

// Runtime photos (uploaded via the CoreOps portal) live on the mounted
// portal-data volume — NOT baked into the image — and are served first so an
// upload wins over a same-named bundled file. PHOTOS_PATH defaults to the
// portal-data mount; missing dir just means no uploads yet.
const photosDir = process.env.PHOTOS_PATH || '/srv/portal-data/photos'
if (existsSync(photosDir)) {
  app.use('/photos', express.static(photosDir))
}

// Serve the built frontend
const dist = join(__dirname, 'public')
if (existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (_req, res) => res.sendFile(join(dist, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`made-by-bren shop listening on :${PORT} (${MOCK ? 'MOCK — no Stripe key' : 'stripe live/test'} mode)`)
})
