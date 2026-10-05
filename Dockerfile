# Made by Bren — production shop (prebuilt artifacts, no npm inside the image)
# Build locally before docker build:
#   VITE_SHOP_MODE=production npm run build
#   (server/node_modules is committed-ready via `cd server && npm install`)

FROM node:22-alpine
WORKDIR /srv
COPY server/package.json ./
COPY server/node_modules ./node_modules
COPY server/index.mjs ./
COPY src/data/catalog.json ./
COPY dist ./public

ENV PORT=4100
EXPOSE 4100
# Runtime env (leave STRIPE_SECRET_KEY unset for mock-checkout test mode):
#   STRIPE_SECRET_KEY  — Brenda's Stripe secret key (test first, live at launch)
#   BASE_URL           — https://shopmadebybren.com
#   FLAT_SHIPPING_CENTS — Brenda's flat shipping amount (default 500 = $5.00)
CMD ["node", "index.mjs"]
