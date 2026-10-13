# Made by Bren — production shop (prebuilt artifacts, no npm inside the image)
# Build locally before docker build:
#   VITE_SHOP_MODE=production npm run build
#   (server/node_modules is committed-ready via `cd server && npm install`)

FROM node:22-alpine
WORKDIR /srv
COPY server/package.json ./
COPY server/node_modules ./node_modules
COPY server/index.mjs ./
COPY dist ./public

ENV PORT=4100
EXPOSE 4100
# Runtime env (leave STRIPE_SECRET_KEY unset for mock-checkout test mode):
#   STRIPE_SECRET_KEY  — Brenda's Stripe secret key (test first, live at launch)
#   BASE_URL           — https://shopmadebybren.com
#   FLAT_SHIPPING_CENTS — Brenda's flat shipping amount (default 500 = $5.00)
#   CATALOG_PATH       — catalog.json location (default /srv/catalog.json)
#   CONTENT_PATH       — content.json overrides (default /srv/content.json)
# The catalog/copy files are NOT baked into the image. Mount their DIRECTORY
# (a single-file bind mount is inode-pinned and would never see the portal's
# atomic os.replace — live-caught 2026-10-12):
#   -v /home/mannyrdh/made-by-bren-shop/portal-data:/srv/portal-data
#   -e CATALOG_PATH=/srv/portal-data/catalog.json
#   -e CONTENT_PATH=/srv/portal-data/content.json
# The server re-reads both on change and refuses to boot without a valid catalog.
CMD ["node", "index.mjs"]
