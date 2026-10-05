import catalog from './catalog.json'

export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '')

/** true when built for shopmadebybren.com — hides demo framing, store becomes the homepage */
export const IS_SHOP = import.meta.env.VITE_SHOP_MODE === 'production'

export type Category = 'bookmarks' | 'keychains' | 'bag-charms' | 'hair-clips' | 'seasonal'

export interface Product {
  id: string
  photo: string
  price: number // display price — the server is the source of truth at checkout
  category: Category
  personalized: boolean
  name: { en: string; es: string }
  blurb: { en: string; es: string }
  igPost?: string
}

export const PRODUCTS: Product[] = catalog as Product[]

export const CATEGORY_LABELS: Record<Category, { en: string; es: string }> = {
  bookmarks: { en: 'Bookmarks', es: 'Marcadores' },
  keychains: { en: 'Keychains', es: 'Llaveros' },
  'bag-charms': { en: 'Bag charms', es: 'Dijes para bolso' },
  'hair-clips': { en: 'Hair clips', es: 'Clips para el pelo' },
  seasonal: { en: 'Seasonal', es: 'De temporada' },
}

export const formatPrice = (n: number) => `$${n.toFixed(2)}`
