ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

ENV CI=true

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/

RUN corepack enable  \
    && corepack prepare pnpm@latest --activate  \
    && pnpm install --filter backend

COPY . .

FROM base AS builder

WORKDIR /app

RUN pnpm install --frozen-lockfile  \
    && pnpm build --filter backend

FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

ENV CI=true

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/

RUN corepack enable  \
    && corepack prepare pnpm@latest --activate  \
    && pnpm install --filter backend --prod

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend

EXPOSE 8080

CMD ["node", "-r", "dotenv/config", "dist/apps/backend/src/index.js"]