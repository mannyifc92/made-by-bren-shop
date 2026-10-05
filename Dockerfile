# Made by Bren — production shop (frontend + checkout API in one container)

# Stage 1: build the frontend (production shop mode: store is the homepage, no demo framing)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ENV VITE_SHOP_MODE=production
RUN npm run build

# Stage 2: runtime — checkout API serves the built frontend
FROM node:22-alpine
WORKDIR /srv
COPY server/package.json server/package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY server/index.mjs ./
COPY src/data/catalog.json ./
COPY --from=build /app/dist ./public

ENV PORT=4100
EXPOSE 4100
# Required at launch (leave unset for test/mock mode):
#   STRIPE_SECRET_KEY  — Brenda's Stripe secret key (test first, live at launch)
#   BASE_URL           — https://shopmadebybren.com
#   FLAT_SHIPPING_CENTS — Brenda's flat shipping amount (default 500 = $5.00)
CMD ["node", "index.mjs"]
