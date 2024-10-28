FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma

RUN npm install

# 
FROM node:20-alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# 
FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=builder /app/.svelte-kit ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["npm", "run", "preview"]