import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'es'

const dict = {
  en: {
    'brand.tag': 'Handmade happy things ✨',
    'brand.sub': 'Bookmarks · Keychains · Custom orders — inspired by nostalgia + family 🎣',
    'brand.location': 'Springville, Utah',
    'nav.back': '← Back to the two options',
    'lang.toggle': 'ES',

    // Chooser
    'choose.hello': 'Hola Brenda 💕',
    'choose.title': 'Two ways to sell your happy things.',
    'choose.body':
      'Two real, clickable demos of what Made by Bren could look like online — both built from your actual Instagram posts. Take a walk through each and see which one feels like you.',
    'choose.a.title': 'Option A · The Shop',
    'choose.a.desc':
      'A real online store. Customers browse, add to cart, and check out while you sleep. You get orders; we handle the tech.',
    'choose.a.cta': 'Walk through the shop →',
    'choose.b.title': 'Option B · The Showcase',
    'choose.b.desc':
      'A beautiful home for your work that sends buyers straight to your Instagram DMs — exactly how you sell today, but easier to share and prettier to look at.',
    'choose.b.cta': 'See the showcase →',
    'choose.note': 'You can also start with B and grow into A later — most makers do. Both demos are bilingual, just like you. 🇦🇷🇺🇸',

    // Store
    'store.hero.badge': 'Demo A · Online store',
    'store.hero.title': 'Happy things, shipped with love.',
    'store.hero.sub':
      'Every bookmark, keychain, and charm is handmade in Springville, Utah — one bead at a time.',
    'store.shop': 'Shop the collection',
    'store.story': 'Our story',
    'store.custom': 'Custom orders',
    'store.custom.body':
      'Have a name, a color, a school, a team, a memory? Brenda loves custom orders — tell her what you\'re dreaming of.',
    'store.custom.cta': 'Request a custom piece',
    'store.add': 'Add to cart',
    'store.added': 'Added ✓',
    'store.personalized': 'Personalizable',
    'store.personalized.hint': 'Add the name in the order notes at checkout',
    'store.cart': 'Cart',
    'store.cart.empty': 'Your cart is empty — go find something happy.',
    'store.cart.total': 'Total',
    'store.checkout': 'Checkout',
    'store.checkout.title': 'Checkout (demo)',
    'store.checkout.name': 'Name',
    'store.checkout.email': 'Email',
    'store.checkout.notes': 'Order notes (names for personalization, colors…)',
    'store.checkout.place': 'Place demo order',
    'store.checkout.success.title': 'Order placed! 🎉',
    'store.checkout.success.body':
      'This is a demo — nothing was charged and no order was sent. In the real shop, Brenda would get your order instantly and start making it.',
    'store.checkout.success.cta': 'Keep browsing',
    'store.demo.ribbon': 'Demo — prices are samples Brenda can change anytime',
    'store.footer': 'Made with 🫶🏼 in Springville, Utah',

    // Showcase
    'show.hero.badge': 'Demo B · Showcase',
    'show.hero.title': 'Made by Bren 💕',
    'show.hero.sub':
      'Handmade happy things — bookmarks, keychains & custom orders, inspired by nostalgia + family. 🎣',
    'show.order': 'DM to order on Instagram',
    'show.gallery': 'Fresh off the craft table',
    'show.gallery.hint': 'Tap any photo to see the original post',
    'show.story.title': 'The story behind the beads',
    'show.story.body':
      'Made by Bren started at a kitchen table in Springville, Utah — with pony beads, a tackle box of charms, and memories of fishing trips and family. Every piece is a little bit of that nostalgia, made to be carried, clipped, or tucked into a good book.',
    'show.how.title': 'How ordering works',
    'show.how.1': 'Browse the gallery and fall in love with something',
    'show.how.2': 'DM @madeby_bren on Instagram with a screenshot',
    'show.how.3': 'Bren makes it (personalized, if you want!) and gets it to you',
    'show.market.badge': 'Find Bren in person',
    'show.market.body': 'Catch the booth at local Utah farmers markets — follow Instagram for dates.',
    'show.custom.cta': 'Ask about a custom order',
    'show.footer': 'Made with 🫶🏼 in Springville, Utah',

    // Quiz engine
    'quiz.next': 'Next →',
    'quiz.back': '← Back',
    'quiz.start': "Let's go →",
    'quiz.of': 'of',
    'quiz.copy': 'Copy my answers',
    'quiz.copied': 'Copied! ✓',
    'quiz.send': 'Email my answers to Manny',
    'quiz.home': '← Back to the demos',
    'quiz.notfound': 'Hmm, that page doesn\'t exist.',
    'quiz.your-answer': 'Your answer',
    'quiz.skipped': 'Skipped',
    'quiz.hello': 'A little quiz from Manny, for Bren 💕',

    // Live checkout
    'store.delivery': 'How do you want your order?',
    'store.delivery.ship': 'Ship it to me (flat-rate US shipping)',
    'store.delivery.pickup': 'Free pickup at the farmers market 🧺',
    'store.personalize-for': 'Name or details for',
    'store.checkout.pay': 'Continue to secure checkout →',
    'store.checkout.working': 'One moment…',
    'store.checkout.error': 'Something went wrong — please try again or DM @madeby_bren.',
    'store.shipping-note': 'Flat-rate shipping is added at checkout. Pickup is always free.',
    'store.preview.title': 'Checkout preview (test mode)',
    'store.preview.body': 'In the live shop, this is where Stripe\'s secure checkout opens — card, Apple Pay, the works. No real charge happens in test mode.',
    'store.success.title': 'Thank you! 🎉',
    'store.success.body': 'Your order is in. Brenda gets an email with everything she needs — including any names to personalize — and she\'ll start making it with love.',
  },
  es: {
    'brand.tag': 'Cositas felices hechas a mano ✨',
    'brand.sub': 'Marcadores · Llaveros · Pedidos personalizados — inspirados en la nostalgia y la familia 🎣',
    'brand.location': 'Springville, Utah',
    'nav.back': '← Volver a las dos opciones',
    'lang.toggle': 'EN',

    'choose.hello': 'Hola Brenda 💕',
    'choose.title': 'Dos formas de vender tus cositas felices.',
    'choose.body':
      'Dos demos reales y recorribles de cómo podría verse Made by Bren en internet — las dos hechas con tus propias fotos de Instagram. Exploralas y fijate cuál se siente más tuya.',
    'choose.a.title': 'Opción A · La Tienda',
    'choose.a.desc':
      'Una tienda online de verdad. Los clientes miran, agregan al carrito y compran mientras dormís. Vos recibís los pedidos; nosotros nos ocupamos de la tecnología.',
    'choose.a.cta': 'Recorrer la tienda →',
    'choose.b.title': 'Opción B · El Escaparate',
    'choose.b.desc':
      'Una vitrina hermosa para tu trabajo que manda a los compradores directo a tus DMs de Instagram — exactamente como vendés hoy, pero más fácil de compartir y más lindo de ver.',
    'choose.b.cta': 'Ver el escaparate →',
    'choose.note': 'También podés empezar con B y crecer hacia A más adelante — la mayoría de los artesanos hace eso. Las dos demos son bilingües, como vos. 🇦🇷🇺🇸',

    'store.hero.badge': 'Demo A · Tienda online',
    'store.hero.title': 'Cositas felices, enviadas con amor.',
    'store.hero.sub':
      'Cada marcador, llavero y dije está hecho a mano en Springville, Utah — una cuenta a la vez.',
    'store.shop': 'Ver la colección',
    'store.story': 'Nuestra historia',
    'store.custom': 'Pedidos personalizados',
    'store.custom.body':
      '¿Tenés un nombre, un color, un equipo, un recuerdo? A Brenda le encantan los pedidos personalizados — contale qué estás soñando.',
    'store.custom.cta': 'Pedir algo personalizado',
    'store.add': 'Agregar al carrito',
    'store.added': 'Agregado ✓',
    'store.personalized': 'Personalizable',
    'store.personalized.hint': 'Escribí el nombre en las notas del pedido al pagar',
    'store.cart': 'Carrito',
    'store.cart.empty': 'Tu carrito está vacío — andá a buscar algo feliz.',
    'store.cart.total': 'Total',
    'store.checkout': 'Finalizar compra',
    'store.checkout.title': 'Finalizar compra (demo)',
    'store.checkout.name': 'Nombre',
    'store.checkout.email': 'Email',
    'store.checkout.notes': 'Notas del pedido (nombres para personalizar, colores…)',
    'store.checkout.place': 'Hacer pedido de prueba',
    'store.checkout.success.title': '¡Pedido hecho! 🎉',
    'store.checkout.success.body':
      'Esto es una demo — no se cobró nada y no se envió ningún pedido. En la tienda real, Brenda recibiría tu pedido al instante y empezaría a hacerlo.',
    'store.checkout.success.cta': 'Seguir mirando',
    'store.demo.ribbon': 'Demo — los precios son ejemplos que Brenda puede cambiar cuando quiera',
    'store.footer': 'Hecho con 🫶🏼 en Springville, Utah',

    'show.hero.badge': 'Demo B · Escaparate',
    'show.hero.title': 'Made by Bren 💕',
    'show.hero.sub':
      'Cositas felices hechas a mano — marcadores, llaveros y pedidos personalizados, inspirados en la nostalgia y la familia. 🎣',
    'show.order': 'Pedí por DM en Instagram',
    'show.gallery': 'Recién salidas de la mesa de trabajo',
    'show.gallery.hint': 'Tocá cualquier foto para ver la publicación original',
    'show.story.title': 'La historia detrás de las cuentas',
    'show.story.body':
      'Made by Bren nació en una mesa de cocina en Springville, Utah — con cuentas de colores, una caja de pesca llena de dijes y recuerdos de salidas de pesca en familia. Cada pieza es un poquito de esa nostalgia, hecha para llevar, colgar o guardar en un buen libro.',
    'show.how.title': 'Cómo pedir',
    'show.how.1': 'Mirá la galería y enamorate de algo',
    'show.how.2': 'Mandale un DM a @madeby_bren en Instagram con una captura',
    'show.how.3': 'Bren lo hace (¡personalizado si querés!) y te lo hace llegar',
    'show.market.badge': 'Encontrá a Bren en persona',
    'show.market.body': 'Visitá su puesto en los farmers markets de Utah — seguila en Instagram para las fechas.',
    'show.custom.cta': 'Consultar por un pedido personalizado',
    'show.footer': 'Hecho con 🫶🏼 en Springville, Utah',

    'quiz.next': 'Siguiente →',
    'quiz.back': '← Atrás',
    'quiz.start': 'Vamos →',
    'quiz.of': 'de',
    'quiz.copy': 'Copiar mis respuestas',
    'quiz.copied': '¡Copiado! ✓',
    'quiz.send': 'Enviar mis respuestas a Manny por email',
    'quiz.home': '← Volver a las demos',
    'quiz.notfound': 'Hmm, esa página no existe.',
    'quiz.your-answer': 'Tu respuesta',
    'quiz.skipped': 'Sin respuesta',
    'quiz.hello': 'Un cuestionariito de Manny, para Bren 💕',

    'store.delivery': '¿Cómo querés tu pedido?',
    'store.delivery.ship': 'Enviámelo (tarifa fija a todo EE. UU.)',
    'store.delivery.pickup': 'Retiro gratis en el farmers market 🧺',
    'store.personalize-for': 'Nombre o detalles para',
    'store.checkout.pay': 'Continuar al pago seguro →',
    'store.checkout.working': 'Un momento…',
    'store.checkout.error': 'Algo salió mal — probá de nuevo o escribile por DM a @madeby_bren.',
    'store.shipping-note': 'El envío de tarifa fija se suma al pagar. El retiro siempre es gratis.',
    'store.preview.title': 'Vista previa del pago (modo prueba)',
    'store.preview.body': 'En la tienda real, acá se abre el pago seguro de Stripe — tarjeta, Apple Pay, todo. En modo prueba no se cobra nada.',
    'store.success.title': '¡Gracias! 🎉',
    'store.success.body': 'Tu pedido ya está. Brenda recibe un email con todo lo que necesita — incluidos los nombres para personalizar — y empieza a hacerlo con amor.',
  },
} as const

export type TKey = keyof (typeof dict)['en']

interface I18nCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (k: TKey) => string
}

const Ctx = createContext<I18nCtx>({ lang: 'en', setLang: () => {}, t: (k) => k })

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const t = (k: TKey) => dict[lang][k] ?? k
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
