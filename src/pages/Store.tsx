import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { PRODUCTS, CATEGORY_LABELS, formatPrice, asset, IS_SHOP, type Category, type Product } from '../data/products'
import { useI18n, LangToggle } from '../i18n'

interface CartLine {
  id: string
  qty: number
}

export default function Store() {
  const { t, lang } = useI18n()
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [delivery, setDelivery] = useState<'ship' | 'pickup'>('ship')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [working, setWorking] = useState(false)
  const [checkoutError, setCheckoutError] = useState(false)
  const [justAdded, setJustAdded] = useState<string | null>(null)

  const visible = useMemo(
    () => (filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter],
  )

  const cartCount = cart.reduce((n, l) => n + l.qty, 0)
  const cartTotal = cart.reduce((sum, l) => {
    const p = PRODUCTS.find((p) => p.id === l.id)
    return sum + (p ? p.price * l.qty : 0)
  }, 0)

  const addToCart = (p: Product) => {
    setCart((c) => {
      const line = c.find((l) => l.id === p.id)
      return line ? c.map((l) => (l.id === p.id ? { ...l, qty: l.qty + 1 } : l)) : [...c, { id: p.id, qty: 1 }]
    })
    setJustAdded(p.id)
    window.setTimeout(() => setJustAdded((cur) => (cur === p.id ? null : cur)), 1200)
  }

  const setQty = (id: string, qty: number) =>
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty } : l))))

  const startCheckout = async () => {
    setWorking(true)
    setCheckoutError(false)
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/checkout`.replace(/\/\/api/, '/api'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: cart, delivery, notes }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const { url } = await res.json()
      window.location.href = url
    } catch {
      setCheckoutError(true)
      setWorking(false)
    }
  }

  const categories: (Category | 'all')[] = ['all', ...Object.keys(CATEGORY_LABELS) as Category[]]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Demo ribbon — demo builds only */}
      {!IS_SHOP && (
        <div className="bg-accent text-accent-foreground text-center text-xs sm:text-sm font-bold py-2 px-4">
          {t('store.demo.ribbon')}
        </div>
      )}

      <header className="flex items-center justify-between px-6 py-5 max-w-6xl w-full mx-auto gap-4">
        {!IS_SHOP ? (
          <Link to="/" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.back')}
          </Link>
        ) : (
          <div className="font-display text-xl font-bold sm:hidden">Made by Bren 💕</div>
        )}
        <div className="font-display text-xl font-bold hidden sm:block">Made by Bren 💕</div>
        <div className="flex items-center gap-3">
          <LangToggle />
          <button
            onClick={() => setCartOpen(true)}
            className="btn-chunky bg-card !px-4 !py-2 text-sm relative"
            aria-label={t('store.cart')}
          >
            🧺 {t('store.cart')}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pb-20">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-10 items-center mt-6 mb-16">
          <div>
            {!IS_SHOP && (
              <span className="sticker bg-primary text-primary-foreground">{t('store.hero.badge')}</span>
            )}
            <h1 className="font-display text-4xl sm:text-5xl font-black mt-6 leading-tight">
              <span className="squiggle inline-block">{t('store.hero.title')}</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{t('store.hero.sub')}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#collection" className="btn-chunky bg-primary text-primary-foreground">
                {t('store.shop')}
              </a>
              <a href="#custom" className="btn-chunky bg-card">
                {t('store.custom.cta')}
              </a>
            </div>
          </div>
          <div className="relative mx-auto max-w-sm">
            <div className="polaroid rotate-2">
              <img src={asset('/photos/post-0908-seahorse.jpg')} alt="Personalized fish keychains" className="rounded-sm aspect-square object-cover" />
            </div>
            <div className="polaroid -rotate-3 absolute -bottom-10 -left-10 w-36 hidden sm:block">
              <img src={asset('/photos/post-0922-pumpkin.jpg')} alt="Fall bookmarks" className="rounded-sm aspect-square object-cover" />
            </div>
          </div>
        </section>

        <div className="wave-divider mb-12" />

        {/* Collection */}
        <section id="collection">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full font-bold text-sm border-2 border-foreground transition-colors ${
                  filter === c ? 'bg-foreground text-background' : 'bg-card hover:bg-muted'
                }`}
              >
                {c === 'all' ? (lang === 'en' ? 'All' : 'Todo') : CATEGORY_LABELS[c][lang]}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map((p, i) => (
              <article
                key={p.id}
                className={`bg-card rounded-3xl border-2 border-foreground/80 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 ${
                  i % 3 === 1 ? 'rotate-[0.4deg]' : i % 3 === 2 ? '-rotate-[0.4deg]' : ''
                }`}
              >
                <div className="relative">
                  <img src={asset(p.photo)} alt={p.name[lang]} className="w-full aspect-square object-cover" loading="lazy" />
                  {p.personalized && (
                    <span className="sticker bg-accent text-accent-foreground absolute top-3 left-3 !text-[10px]">
                      {t('store.personalized')}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display font-bold text-lg leading-snug">{p.name[lang]}</h3>
                    <span className="font-black text-lg whitespace-nowrap">{formatPrice(p.price)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed flex-1">{p.blurb[lang]}</p>
                  {p.personalized && (
                    <p className="text-xs text-muted-foreground italic mt-2">{t('store.personalized.hint')}</p>
                  )}
                  <button
                    onClick={() => addToCart(p)}
                    className={`btn-chunky mt-4 w-full ${
                      justAdded === p.id ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {justAdded === p.id ? t('store.added') : t('store.add')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="wave-divider my-16" />

        {/* Custom orders */}
        <section id="custom" className="stitched rounded-3xl bg-card p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl font-black">
            <span className="squiggle-teal inline-block">{t('store.custom')}</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">{t('store.custom.body')}</p>
          <a
            href="https://www.instagram.com/madeby_bren/"
            target="_blank"
            rel="noreferrer"
            className="btn-chunky bg-secondary text-secondary-foreground mt-6 inline-flex"
          >
            {t('store.custom.cta')}
          </a>
        </section>
      </main>

      <footer className="border-t-2 border-dashed border-foreground/20 py-8 text-center text-sm text-muted-foreground">
        {t('store.footer')} ·{' '}
        <a href="https://www.instagram.com/madeby_bren/" target="_blank" rel="noreferrer" className="font-bold underline">
          @madeby_bren
        </a>
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setCartOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l-2 border-foreground flex flex-col">
            <div className="flex items-center justify-between p-6 border-b-2 border-dashed border-foreground/20">
              <h2 className="font-display text-2xl font-black">🧺 {t('store.cart')}</h2>
              <button onClick={() => setCartOpen(false)} className="text-2xl font-black hover:rotate-90 transition-transform" aria-label="Close">
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {cart.length === 0 && <p className="text-muted-foreground">{t('store.cart.empty')}</p>}
              {cart.map((l) => {
                const p = PRODUCTS.find((p) => p.id === l.id)!
                return (
                  <div key={l.id} className="flex gap-4 items-center">
                    <img src={asset(p.photo)} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-foreground/60" />
                    <div className="flex-1">
                      <div className="font-bold text-sm leading-snug">{p.name[lang]}</div>
                      <div className="text-sm text-muted-foreground">{formatPrice(p.price)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty(l.id, l.qty - 1)} className="w-7 h-7 rounded-full border-2 border-foreground font-black">−</button>
                      <span className="w-5 text-center font-bold">{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.qty + 1)} className="w-7 h-7 rounded-full border-2 border-foreground font-black">+</button>
                    </div>
                  </div>
                )
              })}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t-2 border-dashed border-foreground/20">
                <div className="flex justify-between font-black text-lg mb-4">
                  <span>{t('store.cart.total')}</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <button
                  onClick={() => {
                    setCartOpen(false)
                    setCheckoutOpen(true)
                  }}
                  className="btn-chunky bg-primary text-primary-foreground w-full"
                >
                  {t('store.checkout')}
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Checkout modal — delivery choice + personalization, then off to Stripe */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setCheckoutOpen(false)} />
          <div className="relative bg-card rounded-3xl border-2 border-foreground max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-2xl font-black mb-5">{t('store.delivery')}</h2>

            <div className="flex flex-col gap-3 mb-6">
              {(['ship', 'pickup'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDelivery(d)}
                  className={`btn-chunky !justify-start text-left !font-bold ${
                    delivery === d ? 'bg-secondary text-secondary-foreground' : 'bg-background'
                  }`}
                >
                  {delivery === d ? '☑' : '☐'} {t(d === 'ship' ? 'store.delivery.ship' : 'store.delivery.pickup')}
                </button>
              ))}
            </div>

            {cart.some((l) => PRODUCTS.find((p) => p.id === l.id)?.personalized) && (
              <div className="mb-6">
                {cart
                  .filter((l) => PRODUCTS.find((p) => p.id === l.id)?.personalized)
                  .map((l) => {
                    const p = PRODUCTS.find((p) => p.id === l.id)!
                    return (
                      <div key={l.id} className="mb-3">
                        <label className="block text-sm font-bold mb-1">
                          {t('store.personalize-for')} “{p.name[lang]}”
                        </label>
                        <input
                          value={notes[l.id] ?? ''}
                          onChange={(e) => setNotes((n) => ({ ...n, [l.id]: e.target.value }))}
                          maxLength={200}
                          className="w-full rounded-xl border-2 border-foreground/60 bg-background px-4 py-2.5"
                        />
                      </div>
                    )
                  })}
              </div>
            )}

            <div className="flex justify-between font-black mb-2">
              <span>{t('store.cart.total')}</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5">{t('store.shipping-note')}</p>

            {checkoutError && <p className="text-sm font-bold text-destructive mb-4">{t('store.checkout.error')}</p>}

            <button
              onClick={startCheckout}
              disabled={working}
              className="btn-chunky bg-primary text-primary-foreground w-full disabled:opacity-60"
            >
              {working ? t('store.checkout.working') : t('store.checkout.pay')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
