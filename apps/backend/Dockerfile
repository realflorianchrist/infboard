ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/backend ./apps/backend

RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM base AS builder

WORKDIR /usr/src/app

RUN pnpm install --filter ./apps/backend... --frozen-lockfile

WORKDIR /usr/src/app/apps/backend
RUN pnpm build

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/apps/backend/dist ./dist
COPY --from=builder /usr/src/app/apps/backend/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/src/app/packages ./packages

RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

WORKDIR /usr/src/app/apps/backend

EXPOSE 8080
CMD ["node", "./dist/index.js"]