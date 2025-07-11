ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

ARG NEXT_PUBLIC_API_BASE_URL

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
COPY packages ./packages

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY apps/frontend ./apps/frontend

FROM base AS builder
WORKDIR /usr/src/app/apps/frontend

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN pnpm install --filter ./apps/frontend... --frozen-lockfile

RUN pnpm build

FROM node:${NODE_VERSION}-alpine AS runner

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/apps/frontend/.next ./.next
COPY --from=builder /usr/src/app/apps/frontend/public ./public
COPY --from=builder /usr/src/app/apps/frontend/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/src/app/packages ./packages
COPY --from=builder /usr/src/app/apps/frontend/next.config.js ./next.config.js

RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

WORKDIR /usr/src/app/apps/frontend

EXPOSE 3000
CMD ["pnpm", "start"]