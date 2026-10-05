// Made by Bren — production shop server
// Serves the built frontend and creates Stripe Checkout Sessions.
// If STRIPE_SECRET_KEY is not set, runs in MOCK mode: the checkout flow works
// end to end but redirects to a local preview page instead of Stripe.

import express from 'express'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const catalog = JSON.parse(readFileSync(join(__dirname, 'catalog.json'), 'utf8'))

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
app.use(express.json())

app.post('/api/checkout', async (req, res) => {
  try {
    const { lines, delivery, notes } = req.body || {}
    if (!Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ error: 'empty cart' })
    }
    if (!['ship', 'pickup'].includes(delivery)) {
      return res.status(400).json({ error: 'invalid delivery method' })
    }

    // Server-side catalog is the price source of truth — never trust client prices.
    const lineItems = []
    const personalization = []
    for (const line of lines) {
      const product = catalog.find((p) => p.id === line.id)
      const qty = Math.max(1, Math.min(99, Number(line.qty) || 1))
      if (!product) return res.status(400).json({ error: `unknown product: ${line.id}` })
      lineItems.push({
        quantity: qty,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(product.price * 100),
          product_data: { name: product.name.en },
        },
      })
      const note = (notes?.[product.id] || '').toString().trim().slice(0, 200)
      if (product.personalized && note) {
        personalization.push(`${product.name.en}: ${note}`)
      }
    }

    if (MOCK) {
      const total = lineItems.reduce((s, li) => s + li.price_data.unit_amount * li.quantity, 0)
      const shipping = delivery === 'pickup' ? 0 : FLAT_SHIPPING_CENTS
      const params = new URLSearchParams({
        total: ((total + shipping) / 100).toFixed(2),
        delivery,
        items: String(lineItems.reduce((s, li) => s + li.quantity, 0)),
      })
      return res.json({ url: `${BASE_URL}/checkout-preview?${params}` })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${BASE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/store`,
      shipping_address_collection:
        delivery === 'ship' ? { allowed_countries: ['US'] } : undefined,
      shipping_options:
        delivery === 'pickup'
          ? [
              {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: { amount: 0, currency: 'usd' },
                  display_name: 'Free pickup at the farmers market',
                },
              },
            ]
          : [
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
            ],
      metadata: {
        delivery,
        personalization: personalization.join(' | ').slice(0, 500),
      },
      payment_intent_data: {
        metadata: { delivery, personalization: personalization.join(' | ').slice(0, 500) },
      },
    })
    res.json({ url: session.url })
  } catch (err) {
    console.error('checkout error:', err)
    res.status(500).json({ error: 'checkout failed' })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mode: MOCK ? 'mock' : 'stripe', products: catalog.length })
})

// Serve the built frontend
const dist = join(__dirname, 'public')
if (existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (_req, res) => res.sendFile(join(dist, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`made-by-bren shop listening on :${PORT} (${MOCK ? 'MOCK — no Stripe key' : 'stripe live/test'} mode)`)
})
