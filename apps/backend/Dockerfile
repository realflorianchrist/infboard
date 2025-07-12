FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

ENV CI=true

RUN pnpm install --frozen-lockfile && pnpm --filter ./apps/backend build

WORKDIR /app/apps/backend

CMD ["node", "-r", "dotenv/config", "dist/apps/backend/src/index.js"]