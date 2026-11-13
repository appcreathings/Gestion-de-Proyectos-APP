# Imagen de producción de Hito para Dokploy (o cualquier host Docker).
# Ver server/server.ts para el equivalente de vercel.json + api/.

# ---- Build: SPA (tsc + vite + prerender) y servidor empaquetado ----
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

COPY . .

# Única variable VITE_ que usa el frontend. Vacía => el cliente usa /api (mismo origen).
ARG VITE_GITHUB_BFF_URL=
ENV VITE_GITHUB_BFF_URL=$VITE_GITHUB_BFF_URL
# Limita el heap de Node durante el build (VPS de 2 GB).
ENV NODE_OPTIONS=--max-old-space-size=1024

RUN npm run build && npm run build:server

# ---- Runtime: solo dist/ + servidor (sin node_modules) ----
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/server-dist ./server-dist

USER node
EXPOSE 3000

# Chequea el servidor, no la config de GitHub: /api/github/health da 503 si faltan
# variables, y eso no debe tumbar la web.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/robots.txt >/dev/null || exit 1

CMD ["node", "server-dist/server.mjs"]
