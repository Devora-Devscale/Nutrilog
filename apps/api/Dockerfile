FROM node:latest

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/

RUN pnpm install

COPY ./ ./

WORKDIR /app/apps/api
RUN pnpm prisma generate

RUN pnpm build

EXPOSE 8000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/src/index.js"]
