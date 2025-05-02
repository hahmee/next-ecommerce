# 1단계: 환경 설정 및 dependancy 설치
FROM node:18-alpine AS base
FROM base AS deps
RUN apk add --no-cache libc6-compat
# 명령어를 실행할 디렉터리 지정
WORKDIR /usr/src/app

# Dependancy install을 위해 package.json, package-lock.json 복사
COPY package.json package-lock.json* ./

# 의존성 설치 -> ci : package-lock.json 버전에 맞춰서 다운
RUN npm ci
#RUN npm ci --production
#RUN npm install

# 빌드 캐시 제거
RUN rm -rf ./.next/cache

###########################################################
# 1.5단계: test
FROM deps AS test
WORKDIR /usr/src/app
COPY . .
RUN npm run test


###########################################################
# 2단계: next.js 빌드 단계

# 이전 단계인 base 단계를 기반으로 builder라는 새로운 단계를 정의
FROM base AS builder

# 명령어를 실행할 디렉토리 지정
WORKDIR /usr/src/app

#.dockerignore에 지정된 파일들을 제외하고 나머지 파일들을 복사
COPY . .

COPY --from=deps /usr/src/app/node_modules ./node_modules

# 빌드한다..
RUN npm run build

###########################################################
# 3단계: next.js 실행 단계

# 이전 단계인 base 단계를 기반으로 새로운 단계 runner를 정의
FROM base AS runner

# 작업 디렉토리를 /usr/src/app으로 설정
WORKDIR /usr/src/app

ENV NODE_ENV=production

# 시스템 권한 설정 및 중복되지 않는 uid 설정하여 유저 및 그룹 추가
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

