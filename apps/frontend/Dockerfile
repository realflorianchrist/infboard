FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV CI=true
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

COPY . .

RUN pnpm install --frozen-lockfile && pnpm --filter ./apps/frontend build

WORKDIR /app/apps/frontend

EXPOSE 3000
CMD ["pnpm", "start"]
