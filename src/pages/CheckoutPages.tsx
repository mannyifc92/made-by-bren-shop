import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useI18n, LangToggle } from '../i18n'
import { asset } from '../data/products'

type Download = { name: string; download: string }

export function CheckoutPreview() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const total = params.get('total')
  const delivery = params.get('delivery')
  const items = params.get('items')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="absolute top-5 right-6"><LangToggle /></div>
      <span className="sticker bg-accent text-accent-foreground">🧪 {t('store.preview.title')}</span>
      <h1 className="font-display text-3xl sm:text-4xl font-black mt-6">
        {delivery === 'pickup' ? '🧺' : '📦'} {items} · ${total}
      </h1>
      <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">{t('store.preview.body')}</p>
      <Link to="/store" className="btn-chunky bg-secondary text-secondary-foreground mt-8">
        ← {t('store.shop')}
      </Link>
    </div>
  )
}

export function OrderSuccess() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [downloads, setDownloads] = useState<Download[] | null>(null)

  // Digital orders deliver here: look up the paid session and list its files.
  // Physical orders (and failed lookups) just show the thank-you copy.
  useEffect(() => {
    if (!sessionId) return
    fetch(`${import.meta.env.BASE_URL}api/order-lookup?session_id=${encodeURIComponent(sessionId)}`.replace(/\/\/api/, '/api'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setDownloads(data?.downloads?.length ? data.downloads : []))
      .catch(() => setDownloads([]))
  }, [sessionId])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="absolute top-5 right-6"><LangToggle /></div>
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="font-display text-4xl font-black">
        <span className="squiggle inline-block">{t('store.success.title')}</span>
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">{t('store.success.body')}</p>
      {downloads && downloads.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="font-display text-xl font-black mb-4">{t('store.success.downloads')}</h2>
          <div className="flex flex-col gap-3">
            {downloads.map((d) => (
              <a
                key={d.download}
                href={asset(d.download)}
                download
                className="btn-chunky bg-secondary text-secondary-foreground"
              >
                ⬇️ {d.name}
              </a>
            ))}
          </div>
        </div>
      )}
      <Link to="/store" className="btn-chunky bg-primary text-primary-foreground mt-10">
        ← {t('store.shop')}
      </Link>
    </div>
  )
}
