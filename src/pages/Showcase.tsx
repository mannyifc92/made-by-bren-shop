import { Link } from 'react-router'
import { PRODUCTS, asset } from '../data/products'
import { useI18n, LangToggle } from '../i18n'

const IG = 'https://www.instagram.com/madeby_bren/'

const HERO_COLLAGE = [
  { src: asset('/photos/post-0918-readabook.jpg'), alt: 'Bright beaded bookmarks', rotate: '-rotate-3' },
  { src: asset('/photos/post-0908-seahorse.jpg'), alt: 'Personalized fish keychain', rotate: 'rotate-2' },
  { src: asset('/photos/post-0916-icecream.jpg'), alt: 'Cafecito and conchita bookmark', rotate: '-rotate-1' },
]

export default function Showcase() {
  const { t, lang } = useI18n()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl w-full mx-auto gap-4">
        <Link to="/" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
          {t('nav.back')}
        </Link>
        <div className="font-display text-xl font-bold hidden sm:block">Made by Bren 💕</div>
        <LangToggle />
      </header>

      <main className="flex-1 pb-20">
        {/* Hero — polaroid collage */}
        <section className="max-w-6xl mx-auto px-6 mt-8 mb-20 text-center">
          <span className="sticker bg-secondary text-secondary-foreground">{t('show.hero.badge')}</span>
          <h1 className="font-display text-5xl sm:text-6xl font-black mt-8">
            <span className="squiggle inline-block">{t('show.hero.title')}</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">{t('show.hero.sub')}</p>

          <div className="flex justify-center gap-4 sm:gap-8 mt-12 flex-wrap">
            {HERO_COLLAGE.map((p) => (
              <div key={p.src} className={`polaroid w-40 sm:w-52 ${p.rotate} hover:rotate-0 transition-transform`}>
                <img src={p.src} alt={p.alt} className="rounded-sm aspect-square object-cover" />
              </div>
            ))}
          </div>

          <a href={IG} target="_blank" rel="noreferrer" className="btn-chunky bg-primary text-primary-foreground mt-14 inline-flex text-lg">
            📸 {t('show.order')}
          </a>
        </section>

        <div className="wave-divider mb-16" />

        {/* Gallery */}
        <section className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl font-black text-center">
            <span className="squiggle-teal inline-block">{t('show.gallery')}</span>
          </h2>
          <p className="text-center text-muted-foreground mt-3 mb-10">{t('show.gallery.hint')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {PRODUCTS.filter((p) => p.igPost).map((p, i) => (
              <a
                key={p.id}
                href={p.igPost}
                target="_blank"
                rel="noreferrer"
                className={`group relative rounded-2xl overflow-hidden border-2 border-foreground/70 transition-transform hover:-translate-y-1 hover:rotate-0 ${
                  i % 2 ? 'rotate-[0.6deg]' : '-rotate-[0.6deg]'
                }`}
              >
                <img src={asset(p.photo)} alt={p.name[lang]} className="w-full aspect-square object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/35 transition-colors flex items-end">
                  <span className="text-background font-bold text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {p.name[lang]} ↗
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <div className="wave-divider my-16" />

        {/* Story */}
        <section className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-black">
            <span className="squiggle inline-block">{t('show.story.title')}</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{t('show.story.body')}</p>
        </section>

        <div className="wave-divider my-16" />

        {/* How to order */}
        <section className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl font-black text-center mb-10">
            <span className="squiggle-teal inline-block">{t('show.how.title')}</span>
          </h2>
          <ol className="grid sm:grid-cols-3 gap-6">
            {[t('show.how.1'), t('show.how.2'), t('show.how.3')].map((step, i) => (
              <li key={i} className="stitched rounded-3xl bg-card p-6 text-center">
                <div className="sticker bg-accent text-accent-foreground !text-sm mb-4">{i + 1}</div>
                <p className="font-bold leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          <div className="text-center mt-10">
            <a href={IG} target="_blank" rel="noreferrer" className="btn-chunky bg-secondary text-secondary-foreground inline-flex">
              {t('show.custom.cta')}
            </a>
          </div>
        </section>

        <div className="wave-divider my-16" />

        {/* Farmers market */}
        <section className="max-w-2xl mx-auto px-6">
          <div className="stitched rounded-3xl bg-card p-8 text-center">
            <span className="sticker bg-primary text-primary-foreground">{t('show.market.badge')}</span>
            <p className="mt-5 text-muted-foreground leading-relaxed">{t('show.market.body')}</p>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-dashed border-foreground/20 py-8 text-center text-sm text-muted-foreground">
        {t('show.footer')} ·{' '}
        <a href={IG} target="_blank" rel="noreferrer" className="font-bold underline">
          @madeby_bren
        </a>
      </footer>
    </div>
  )
}
