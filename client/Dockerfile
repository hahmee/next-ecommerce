## Install dependencies
#FROM node:18-alpine AS deps
#WORKDIR /app
#COPY package.json package-lock.json ./
#RUN npm ci
#
## Build output (Next.js 빌드 결과는 로컬에서 이미 수행됨)
#FROM node:18-alpine AS runner
#WORKDIR /app
#
#ENV NODE_ENV=production
#
#COPY --from=deps /app/node_modules ./node_modules
#COPY .next/standalone ./
#COPY .next/static ./.next/static
#COPY public ./public
#
#EXPOSE 3000
#CMD ["node", "server.js"]
