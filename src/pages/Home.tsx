import { Link } from 'react-router'
import { useI18n, LangToggle } from '../i18n'
import { asset } from '../data/products'

export default function Home() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 max-w-5xl w-full mx-auto">
        <div className="font-display text-xl font-bold">Made by Bren 💕</div>
        <LangToggle />
      </header>

      <main className="flex-1 px-6 pb-16 max-w-5xl w-full mx-auto">
        <section className="text-center mt-10 mb-14">
          <span className="sticker bg-accent text-accent-foreground mb-6 inline-block">
            {t('choose.hello')}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
            <span className="squiggle inline-block">{t('choose.title')}</span>
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('choose.body')}
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 md:gap-10">
          <Link
            to="/store"
            className="group stitched rounded-3xl bg-card p-8 flex flex-col transition-transform hover:-translate-y-1 hover:rotate-[0.5deg]"
          >
            <span className="sticker bg-primary text-primary-foreground self-start">
              {t('choose.a.title')}
            </span>
            <div className="grid grid-cols-3 gap-2 my-6">
              {[asset('/photos/post-0908-seahorse.jpg'), asset('/photos/post-0918-readabook.jpg'), asset('/photos/post-0917-jewelry.jpg')].map(
                (src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className={`rounded-xl object-cover aspect-square border-2 border-foreground/80 ${
                      i === 1 ? 'rotate-2' : '-rotate-1'
                    }`}
                  />
                ),
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed flex-1">{t('choose.a.desc')}</p>
            <span className="btn-chunky bg-primary text-primary-foreground mt-6 self-start group-hover:translate-x-1 transition-transform">
              {t('choose.a.cta')}
            </span>
          </Link>

          <Link
            to="/showcase"
            className="group stitched rounded-3xl bg-card p-8 flex flex-col transition-transform hover:-translate-y-1 hover:-rotate-[0.5deg]"
          >
            <span className="sticker bg-secondary text-secondary-foreground self-start">
              {t('choose.b.title')}
            </span>
            <div className="grid grid-cols-3 gap-2 my-6">
              {[asset('/photos/post-0916-icecream.jpg'), asset('/photos/post-0922-pumpkin.jpg'), asset('/photos/post-0911-hairclips.jpg')].map(
                (src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className={`rounded-xl object-cover aspect-square border-2 border-foreground/80 ${
                      i === 1 ? '-rotate-2' : 'rotate-1'
                    }`}
                  />
                ),
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed flex-1">{t('choose.b.desc')}</p>
            <span className="btn-chunky bg-secondary text-secondary-foreground mt-6 self-start group-hover:translate-x-1 transition-transform">
              {t('choose.b.cta')}
            </span>
          </Link>
        </section>

        <p className="text-center text-muted-foreground mt-12 max-w-xl mx-auto">{t('choose.note')}</p>
      </main>
    </div>
  )
}
