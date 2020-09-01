FROM node:current-alpine
WORKDIR /app
RUN sudo apt update
RUN sudo apt install software-properties-common
RUN sudo add-apt-repository ppa:deadsnakes/ppa
RUN sudo apt update
RUN sudo apt install python3.8
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn run build
ENV PORT=8080
CMD [ "yarn", "run", "start:prod" ]