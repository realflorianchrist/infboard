ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/

RUN corepack enable \
  && corepack prepare pnpm@latest --activate \
  && pnpm install --filter frontend...

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY --from=deps /app ./
COPY . .

RUN corepack enable \
  && corepack prepare pnpm@latest --activate \
  && pnpm build --filter frontend...

FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs  \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static

RUN chown -R nextjs:nodejs ./

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

WORKDIR /app/apps/frontend

CMD ["node", "server.js"]