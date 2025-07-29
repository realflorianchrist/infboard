ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

ENV CI=true

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/

RUN corepack enable  \
    && corepack prepare pnpm@latest --activate  \
    && pnpm install --filter frontend

COPY . .

FROM base AS builder

WORKDIR /app

RUN pnpm install --frozen-lockfile  \
    && pnpm build --filter frontend

FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

ENV CI=true

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/

RUN corepack enable  \
    && corepack prepare pnpm@latest --activate  \
    && pnpm install --filter frontend --prod

COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

WORKDIR /app/apps/frontend

EXPOSE 3000

CMD ["pnpm", "start"]