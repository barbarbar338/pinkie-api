# A Dockerfile for building and running the nodejs app that utilizes the nestjs framework and canvas library using Ubuntu

# Use the official image as a parent image
FROM ubuntu

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at the working directory
COPY . .

# Install any needed packages
RUN apt update && apt upgrade -y && apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt install -y nodejs git make gcc g++ python3 build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Install yarn
RUN npm i -g yarn

# Install the app dependencies and build the app
RUN yarn install --frozen-lockfile
RUN yarn build

# Run the app when the container launches
CMD ["yarn", "start:prod"]
