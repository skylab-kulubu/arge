FROM --platform=linux/amd64 node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM --platform=linux/amd64 node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG CMS_URL
ARG CMS_CDN_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_FORMS_URL
ENV CMS_URL=$CMS_URL
ENV CMS_CDN_URL=$CMS_CDN_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_FORMS_URL=$NEXT_PUBLIC_FORMS_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN test -n "$CMS_URL" \
    && test -n "$CMS_CDN_URL" \
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
