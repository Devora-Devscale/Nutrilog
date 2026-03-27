FROM node:latest

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/platform/package.json apps/platform/
COPY apps/api/package.json apps/api/
COPY packages/schema/ packages/schema/

RUN pnpm install

COPY . .
RUN pnpm --filter @nutrilog/schema build
RUN pnpm db:generate
RUN pnpm --filter @nutrilog/api build
WORKDIR /app/apps/platform
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]



