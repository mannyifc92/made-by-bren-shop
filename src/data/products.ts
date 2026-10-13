import { useSyncExternalStore } from 'react'
import bundledCatalog from './catalog.json'

export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '')

/** true when built for shopmadebybren.com — hides demo framing, store becomes the homepage */
export const IS_SHOP = import.meta.env.VITE_SHOP_MODE === 'production'

export type Category = 'bookmarks' | 'keychains' | 'bag-charms' | 'hair-clips' | 'seasonal'

export interface Product {
  id: string
  photo?: string // optional — portal-added products may have none yet (placeholder renders)
  price: number // display price — the server is the source of truth at checkout
  category: Category
  personalized: boolean
  hidden?: boolean // set by the CoreOps portal — hidden products never render
  stockNote?: { en: string; es: string }
  name: { en: string; es: string }
  blurb?: { en: string; es: string }
  igPost?: string
}

// The catalog is served live by the shop server (GET /api/catalog) so portal
// edits show up without a rebuild. The bundled copy is only a boot fallback —
// if the fetch fails we still render, never a blank store.
// Hidden products are filtered server-side too; this is defense in depth.
const onlyVisible = (list: Product[]) => list.filter((p) => !p.hidden)

let current: Product[] = onlyVisible(bundledCatalog as Product[])
const listeners = new Set<() => void>()

fetch(`${import.meta.env.BASE_URL}api/catalog`.replace(/\/\/api/, '/api'))
  .then((res) => {
    if (!res.ok) throw new Error(String(res.status))
    return res.json()
  })
  .then((data: Product[]) => {
    if (Array.isArray(data) && data.length > 0) {
      current = onlyVisible(data)
      listeners.forEach((fn) => fn())
    }
  })
  .catch((err) => console.error('live catalog fetch failed, using bundled copy:', err))

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// Stable snapshot: `current` is only reassigned when the fetch lands, so
// useSyncExternalStore never sees a fresh-but-equal array.
const getSnapshot = () => current

/** Live product list (visible only). Re-renders when /api/catalog lands. */
export function useProducts(): Product[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export const CATEGORY_LABELS: Record<Category, { en: string; es: string }> = {
  bookmarks: { en: 'Bookmarks', es: 'Marcadores' },
  keychains: { en: 'Keychains', es: 'Llaveros' },
  'bag-charms': { en: 'Bag charms', es: 'Dijes para bolso' },
  'hair-clips': { en: 'Hair clips', es: 'Clips para el pelo' },
  seasonal: { en: 'Seasonal', es: 'De temporada' },
}

export const formatPrice = (n: number) => `$${n.toFixed(2)}`
