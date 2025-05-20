# Node.js 18 알파인 기반의 경량 이미지 사용 (빌드 없이 실행만 하는 단계)
FROM node:18-alpine AS runner

# 앱 실행 디렉토리 설정
WORKDIR /usr/src/app

# 환경변수를 production으로 설정 (Next.js에서 최적화 실행됨)
ENV NODE_ENV=production

# nodejs 그룹을 생성 (gid 1001)
RUN addgroup --system --gid 1001 nodejs

# nextjs 사용자 생성 (uid 1001)
RUN adduser --system --uid 1001 nextjs

# public 디렉토리 복사
COPY public ./public

# standalone 모드로 빌드된 실행파일 복사 (Next.js에서 `output: 'standalone'` 설정 필요)
COPY .next/standalone ./

# 정적 리소스(.next/static) 복사 (Next.js에서 생성된 정적 자산)
COPY .next/static ./.next/static

# 의존성 모듈 복사 (standalone 디렉토리에 포함되지 않은 경우를 위해)
COPY node_modules ./node_modules

# nextjs 사용자로 실행 (root 아님 → 보안 강화)
USER nextjs

# 앱이 열 포트 설정 (보통 3000번)
EXPOSE 3000

# 컨테이너 시작 시 실행할 명령 (Next.js 서버 실행)
CMD ["node", "standalone/server.js"]
