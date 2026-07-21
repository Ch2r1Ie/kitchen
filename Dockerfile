FROM node:22-alpine AS deps
WORKDIR /src
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS build
WORKDIR /src
RUN corepack enable
COPY --from=deps /src/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=build /src/public ./public
COPY --from=build --chown=nextjs:nodejs /src/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /src/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENTRYPOINT ["node", "server.js"]
