FROM node:current-alpine
WORKDIR /app
RUN apt-get update || : && apt-get install python -y
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn run build
ENV PORT=8080
CMD [ "yarn", "run", "start:prod" ]