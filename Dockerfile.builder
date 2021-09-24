FROM node:14-alpine as builder

WORKDIR /vendure

COPY package.json yarn.lock ./

COPY . .

RUN apk update
RUN apk upgrade
RUN apk add --no-cache git
RUN apk add --no-cache openssh
RUN apk add --update-cache \
    python \
    python-dev \
    make \
    g++ \
  && rm -rf /var/cache/apk/*

RUN apk add curl bash --no-cache
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

RUN npm install --quiet node-gyp typescript lerna pm2 -g
RUN rm -rf ./node_modules

RUN lerna bootstrap
RUN yarn
RUN yarn build

# remove development dependencies
RUN npm prune --production
RUN lerna exec -- npm prune --production
RUN /usr/local/bin/node-prune
RUN lerna exec -- /usr/local/bin/node-prune
RUN yarn install --production
