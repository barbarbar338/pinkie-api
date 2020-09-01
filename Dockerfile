FROM node:current-alpine
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn run build
ENV PORT=8080
CMD [ "yarn", "run", "start:prod" ]