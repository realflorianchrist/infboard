ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
COPY packages ./packages

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY apps/backend ./apps/backend

FROM base AS builder
WORKDIR /usr/src/app/apps/backend
RUN pnpm build

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/backend ./apps/backend

COPY --from=builder /usr/src/app/apps/backend/dist ./apps/backend/dist

EXPOSE 8080

CMD ["node", "./apps/backend/dist/index.js"]
