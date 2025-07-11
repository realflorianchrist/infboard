ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

ARG NEXT_PUBLIC_API_BASE_URL

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/frontend ./apps/frontend

RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM base AS builder

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

WORKDIR /usr/src/app/apps/frontend
RUN pnpm build

FROM node:${NODE_VERSION}-alpine AS runner

ENV NODE_ENV=production
WORKDIR /usr/src/app/apps/frontend

COPY --from=builder /usr/src/app/apps/frontend/.next ./.next
COPY --from=builder /usr/src/app/apps/frontend/public ./public
COPY --from=builder /usr/src/app/apps/frontend/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ../../pnpm-lock.yaml
COPY --from=builder /usr/src/app/packages ../../packages
COPY --from=builder /usr/src/app/apps/frontend/next.config.ts ./next.config.ts

RUN npm install -g pnpm && pnpm install --filter ./apps/frontend --prod --frozen-lockfile

EXPOSE 3000
CMD ["pnpm", "start"]
