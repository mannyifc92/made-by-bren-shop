import { Link, useSearchParams } from 'react-router'
import { useI18n, LangToggle } from '../i18n'

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
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="absolute top-5 right-6"><LangToggle /></div>
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="font-display text-4xl font-black">
        <span className="squiggle inline-block">{t('store.success.title')}</span>
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">{t('store.success.body')}</p>
      <Link to="/store" className="btn-chunky bg-primary text-primary-foreground mt-10">
        ← {t('store.shop')}
      </Link>
    </div>
  )
}
