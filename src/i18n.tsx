import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'es'

// The default site copy lives in data/content-defaults.json — the shop's
// server and the CoreOps portal read the same file (the portal validates
// editable keys and shows defaults for its copy-editing UI). Brenda's live
// edits are overrides served from /api/content, layered on top below.
import dict from './data/content-defaults.json'

export type TKey = keyof (typeof dict)['en']

interface I18nCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (k: TKey) => string
}

const Ctx = createContext<I18nCtx>({ lang: 'en', setLang: () => {}, t: (k) => k })

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  // Live copy overrides from GET /api/content (written by the CoreOps portal).
  // Bundled dict stays the default; overrides layer on top per key+language.
  const [overrides, setOverrides] = useState<Partial<Record<TKey, { en?: string; es?: string }>>>({})
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}api/content`.replace(/\/\/api/, '/api'))
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => {
        if (data && typeof data === 'object' && !Array.isArray(data)) setOverrides(data)
      })
      .catch(() => {}) // no overrides reachable — bundled copy is the site text
  }, [])
  const t = (k: TKey) => overrides[k]?.[lang] ?? dict[lang][k] ?? k
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)

export function LangToggle({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n()
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      className={`btn-chunky bg-accent text-accent-foreground !px-4 !py-2 text-sm ${className}`}
      aria-label="Switch language"
    >
      {t('lang.toggle')}
    </button>
  )
}
