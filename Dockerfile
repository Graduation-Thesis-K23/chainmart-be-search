FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

FROM node:18-alpine as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

USER nestjs

CMD ["node", "dist/main"]