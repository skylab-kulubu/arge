FROM --platform=linux/amd64 node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM --platform=linux/amd64 node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# `next build` inlines the NEXT_PUBLIC_* values and API_BASE_URL (core's host, for the CMS
# image bridge; see next.config.mjs). CMS_URL, KEYCLOAK_* and NEXTAUTH_* are runtime
# settings: give them to the container, not to the build.
ARG API_BASE_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_FORMS_URL
ENV API_BASE_URL=$API_BASE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_FORMS_URL=$NEXT_PUBLIC_FORMS_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN test -n "$API_BASE_URL" \
    && test -n "$NEXT_PUBLIC_SITE_URL" \
    && test -n "$NEXT_PUBLIC_FORMS_URL" \
    && npx next build

FROM --platform=linux/amd64 node:22-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
