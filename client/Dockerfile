FROM node:18-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY node_modules ./node_modules

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]