FROM node:14-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

COPY . .

RUN apk update
RUN apk upgrade
RUN apk add --no-cache git
RUN apk add --no-cache openssh
RUN apk add --no-cache python3
RUN apk add --no-cache python3-dev
RUN apk add --no-cache make
RUN apk add --no-cache g++

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

FROM node:14-alpine as runner

WORKDIR /app

RUN npm install --quiet pm2 -g

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/*.js ./
COPY --from=builder /app/*.json ./

COPY --from=builder /app/packages/admin-ui-plugin ./packages/admin-ui-plugin
COPY --from=builder /app/packages/admin-ui ./packages/admin-ui
COPY --from=builder /app/packages/asset-server-plugin ./packages/asset-server-plugin
COPY --from=builder /app/packages/common ./packages/common
COPY --from=builder /app/packages/core ./packages/core
COPY --from=builder /app/packages/create ./packages/create
COPY --from=builder /app/packages/elasticsearch-plugin ./packages/elasticsearch-plugin
COPY --from=builder /app/packages/email-plugin ./packages/email-plugin
COPY --from=builder /app/packages/job-queue-plugin ./packages/job-queue-plugin
COPY --from=builder /app/packages/payment-plugin ./packages/payment-plugin
COPY --from=builder /app/packages/server ./packages/server
COPY --from=builder /app/packages/ui-devkit ./packages/ui-devkit

EXPOSE 3000
