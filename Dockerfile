FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

RUN yarn install --frozen-lockfile

RUN yarn build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 80

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api

COPY --from=builder /app ./

USER api

CMD ["yarn", "start"]
