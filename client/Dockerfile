# 1단계: 환경 설정 및 dependancy 설치
FROM node:18-alpine AS base
FROM base AS deps
RUN apk add --no-cache libc6-compat
# 명령어를 실행할 디렉터리 지정
WORKDIR /usr/src/app

# Dependancy install을 위해 package.json, package-lock.json 복사
COPY package.json package-lock.json* ./

# 의존성 설치 -> ci : package-lock.json 버전에 맞춰서 다운
RUN npm ci --production

RUN rm -rf ./.next/cache


###########################################################
# 2단계: next.js 빌드 단계
FROM base AS builder
# 명령어를 실행할 디렉토리 지정
WORKDIR /usr/src/app


# node_modules 등의 dependancy를 복사함.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

###########################################################

# 3단계: next.js 실행 단계
FROM base AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

