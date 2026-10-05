export interface QuizOption {
  id: string
  label: { en: string; es: string }
}

export interface QuizQuestion {
  id: string
  text: { en: string; es: string }
  hint?: { en: string; es: string }
  multi: boolean
  options: QuizOption[]
}

export interface Quiz {
  slug: string
  emoji: string
  title: { en: string; es: string }
  intro: { en: string; es: string }
  resultTitle: { en: string; es: string }
  resultNote: { en: string; es: string }
  freeTextLabel: { en: string; es: string }
  questions: QuizQuestion[]
}

export const SHOP_QUIZ: Quiz = {
  slug: 'shop',
  emoji: '🛍️',
  title: { en: "Let's build your shop", es: 'Armemos tu tienda' },
  intro: {
    en: 'A few quick taps and your shop basically designs itself. No wrong answers — just tell us what sounds good.',
    es: 'Unos toques rapiditos y tu tienda prácticamente se diseña sola. No hay respuestas incorrectas — decinos qué te suena bien.',
  },
  resultTitle: { en: 'Your shop blueprint 📋', es: 'El plan de tu tienda 📋' },
  resultNote: {
    en: 'Screenshot this or copy it and send it to Manny — it has everything needed to build the real thing.',
    es: 'Sacale una captura o copialo y mandáselo a Manny — tiene todo lo que se necesita para construir la tienda de verdad.',
  },
  freeTextLabel: {
    en: 'Anything else you dream about for your shop? (optional)',
    es: '¿Algo más que soñás para tu tienda? (opcional)',
  },
  questions: [
    {
      id: 'products',
      multi: true,
      text: { en: 'Which of your creations go in the shop at launch?', es: '¿Cuáles de tus creaciones van en la tienda para el lanzamiento?' },
      hint: { en: 'Tap as many as you want', es: 'Tocá todas las que quieras' },
      options: [
        { id: 'bookmarks', label: { en: 'Bookmarks', es: 'Marcadores' } },
        { id: 'keychains', label: { en: 'Keychains', es: 'Llaveros' } },
        { id: 'bag-charms', label: { en: 'Bag charms', es: 'Dijes para bolso' } },
        { id: 'hair-clips', label: { en: 'Hair clips', es: 'Clips para el pelo' } },
        { id: 'seasonal', label: { en: 'Seasonal specials', es: 'Especiales de temporada' } },
        { id: 'everything', label: { en: 'Everything I make!', es: '¡Todo lo que hago!' } },
      ],
    },
    {
      id: 'shipping-rule',
      multi: false,
      text: { en: 'How should shipping work for your customers?', es: '¿Cómo debería funcionar el envío para tus clientes?' },
      options: [
        { id: 'flat', label: { en: 'One flat rate for everyone (most makers do this)', es: 'Una tarifa fija para todos (lo que hace la mayoría)' } },
        { id: 'free-over', label: { en: 'Free shipping over a certain amount', es: 'Envío gratis a partir de cierto monto' } },
        { id: 'free-always', label: { en: 'Always free — I\'ll include it in my prices', es: 'Siempre gratis — lo incluyo en mis precios' } },
        { id: 'unsure', label: { en: 'Not sure — suggest what works for most makers', es: 'No sé — sugerime lo que funciona para la mayoría' } },
      ],
    },
    {
      id: 'shipping-area',
      multi: false,
      text: { en: 'Where will you ship?', es: '¿A dónde vas a enviar?' },
      options: [
        { id: 'utah', label: { en: 'Just Utah for now', es: 'Solo Utah por ahora' } },
        { id: 'us', label: { en: 'Anywhere in the US', es: 'Todo Estados Unidos' } },
        { id: 'international', label: { en: 'US and other countries too', es: 'Estados Unidos y otros países también' } },
        { id: 'unsure', label: { en: 'Not sure yet', es: 'Todavía no sé' } },
      ],
    },
    {
      id: 'pickup',
      multi: false,
      text: { en: 'Want to offer free pickup at your farmers market booth?', es: '¿Querés ofrecer retiro gratis en tu puesto del farmers market?' },
      hint: { en: 'Neighbors love this option — and it saves you shipping', es: 'A los vecinos les encanta esta opción — y te ahorra el envío' },
      options: [
        { id: 'yes', label: { en: 'Yes, that sounds great', es: 'Sí, suena genial' } },
        { id: 'no', label: { en: 'No, shipping only', es: 'No, solo envíos' } },
        { id: 'later', label: { en: 'Maybe later', es: 'Quizás más adelante' } },
      ],
    },
    {
      id: 'personalization',
      multi: false,
      text: { en: 'When someone wants a name on their keychain, how do you want to get those details?', es: 'Cuando alguien quiera un nombre en su llavero, ¿cómo preferís recibir esos detalles?' },
      options: [
        { id: 'checkout-box', label: { en: 'A little box at checkout where they type it', es: 'Un recuadrito al pagar donde lo escriben' } },
        { id: 'dm-after', label: { en: 'They message me after ordering, like now', es: 'Me escriben después de comprar, como ahora' } },
        { id: 'unsure', label: { en: 'Whichever is easier for them', es: 'Lo que sea más fácil para ellos' } },
      ],
    },
    {
      id: 'good-week',
      multi: false,
      text: { en: 'Dream a little: what would a GOOD week of orders look like?', es: 'Soñá un poquito: ¿cómo sería una BUENA semana de pedidos?' },
      hint: { en: 'This helps size everything right — no pressure', es: 'Esto ayuda a dimensionar todo bien — sin presión' },
      options: [
        { id: '1-5', label: { en: '1–5 orders would make my week', es: '1–5 pedidos me harían la semana' } },
        { id: '5-15', label: { en: '5–15 orders sounds amazing', es: '5–15 pedidos suena increíble' } },
        { id: '15+', label: { en: '15+ — let\'s go big!', es: '¡15+ — vamos por todo!' } },
        { id: 'no-idea', label: { en: 'Honestly, no idea yet', es: 'Sinceramente, todavía no sé' } },
      ],
    },
  ],
}

export const SERVICES_QUIZ: Quiz = {
  slug: 'services',
  emoji: '🤝',
  title: { en: 'How can Manny help?', es: '¿Cómo te puede ayudar Manny?' },
  intro: {
    en: 'Beyond the website, there are a few ways to make the business side lighter. Tap whatever sounds useful — nothing here is a commitment.',
    es: 'Además del sitio web, hay algunas formas de hacer más liviana la parte del negocio. Tocá lo que te suene útil — nada de esto es un compromiso.',
  },
  resultTitle: { en: 'Ways Manny can help 🌱', es: 'Formas en que Manny puede ayudar 🌱' },
  resultNote: {
    en: 'Screenshot this or copy it and send it to Manny — you\'ll figure out together what (if anything) makes sense.',
    es: 'Sacale una captura o copialo y mandáselo a Manny — van a ver juntos qué tiene sentido (si es que algo).',
  },
  freeTextLabel: {
    en: 'Anything else on your mind? (optional)',
    es: '¿Algo más en mente? (opcional)',
  },
  questions: [
    {
      id: 'instagram-feel',
      multi: false,
      text: { en: 'How do you feel about posting on Instagram these days?', es: '¿Cómo te sentís con publicar en Instagram estos días?' },
      options: [
        { id: 'love', label: { en: 'I love it — it\'s the fun part', es: 'Me encanta — es la parte divertida' } },
        { id: 'tiring', label: { en: 'I do it, but it tires me out', es: 'Lo hago, pero me cansa' } },
        { id: 'struggle', label: { en: 'I struggle to keep up', es: 'Me cuesta mantener el ritmo' } },
      ],
    },
    {
      id: 'content-help',
      multi: false,
      text: { en: 'Would content ideas and a simple posting rhythm help?', es: '¿Te ayudaría tener ideas de contenido y un ritmo de publicación simple?' },
      options: [
        { id: 'yes', label: { en: 'Yes, that would be lovely', es: 'Sí, estaría lindo' } },
        { id: 'maybe', label: { en: 'Maybe — tell me more', es: 'Quizás — contame más' } },
        { id: 'no', label: { en: 'No thanks, I\'ve got this', es: 'No gracias, yo me encargo' } },
      ],
    },
    {
      id: 'photos',
      multi: false,
      text: { en: 'How do you feel about your product photos?', es: '¿Cómo te sentís con las fotos de tus productos?' },
      options: [
        { id: 'love', label: { en: 'Love them as they are', es: 'Me encantan como están' } },
        { id: 'okay', label: { en: 'They\'re okay, could be better', es: 'Están bien, podrían ser mejores' } },
        { id: 'guidance', label: { en: 'I\'d love simple photo tips', es: 'Me encantaría recibir tips simples de fotos' } },
      ],
    },
    {
      id: 'branding',
      multi: false,
      text: { en: 'Do you have a logo and look you love?', es: '¿Tenés un logo y una imagen que te encanten?' },
      options: [
        { id: 'yes', label: { en: 'Yes, I\'m happy with it', es: 'Sí, estoy contenta con eso' } },
        { id: 'kind-of', label: { en: 'Kind of — it could use polish', es: 'Más o menos — le vendría bien un pulido' } },
        { id: 'no', label: { en: 'Not really — I\'d love help', es: 'La verdad no — me encantaría ayuda' } },
      ],
    },
    {
      id: 'market-materials',
      multi: true,
      text: { en: 'For your farmers market booth, what would help?', es: 'Para tu puesto del farmers market, ¿qué te ayudaría?' },
      hint: { en: 'Tap as many as you want', es: 'Tocá todas las que quieras' },
      options: [
        { id: 'qr-card', label: { en: 'A QR card so people find my shop', es: 'Una tarjeta con QR para que la gente encuentre mi tienda' } },
        { id: 'banner', label: { en: 'A cute banner or sign', es: 'Un cartel o banner lindo' } },
        { id: 'price-signs', label: { en: 'Pretty price signs', es: 'Cartelitos de precios bonitos' } },
        { id: 'none', label: { en: 'I\'m set for now', es: 'Estoy bien por ahora' } },
      ],
    },
    {
      id: 'business-side',
      multi: true,
      text: { en: 'The business side — any of these on your mind?', es: 'La parte del negocio — ¿algo de esto en mente?' },
      hint: { en: 'Tap as many as you want', es: 'Tocá todas las que quieras' },
      options: [
        { id: 'pricing', label: { en: 'Help pricing my work', es: 'Ayuda para ponerle precio a mi trabajo' } },
        { id: 'money-tracking', label: { en: 'Keeping track of money simply', es: 'Llevar la plata de forma simple' } },
        { id: 'email-list', label: { en: 'An email list for my customers', es: 'Una lista de emails para mis clientes' } },
        { id: 'none', label: { en: 'None of these right now', es: 'Nada de esto por ahora' } },
      ],
    },
    {
      id: 'care-plan',
      multi: false,
      text: { en: 'After your free month, how do you feel about the website care plan?', es: 'Después de tu mes gratis, ¿cómo te sentís con el plan de cuidado del sitio?' },
      options: [
        { id: 'sounds-good', label: { en: 'It sounds good — let\'s talk after launch', es: 'Suena bien — hablemos después del lanzamiento' } },
        { id: 'self', label: { en: 'I\'ll probably handle it myself', es: 'Probablemente me encargue yo' } },
        { id: 'unsure', label: { en: 'Not sure yet — no pressure either way', es: 'Todavía no sé — sin presión de todas formas' } },
      ],
    },
  ],
}

export const QUIZZES: Record<string, Quiz> = {
  shop: SHOP_QUIZ,
  services: SERVICES_QUIZ,
}
