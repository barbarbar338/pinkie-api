FROM node:18-alpine

RUN apk add g++ make python3 pkgconfig cairo-dev jpeg-dev pango-dev giflib-dev cairo pango libjpeg giflib

WORKDIR /app
COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build

ENV NODE_ENV production
ENV PORT 80

CMD ["yarn", "start"]
