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

FROM node:14-alpine as runner

WORKDIR /vendure

RUN npm install --quiet pm2 -g

COPY --from=builder /vendure/node_modules ./node_modules

COPY --from=builder /vendure/*.js ./
COPY --from=builder /vendure/*.json ./

COPY --from=builder /vendure/packages/admin-ui-plugin ./packages/admin-ui-plugin
COPY --from=builder /vendure/packages/admin-ui ./packages/admin-ui
COPY --from=builder /vendure/packages/asset-server-plugin ./packages/asset-server-plugin
COPY --from=builder /vendure/packages/bank-transfer-plugin ./packages/bank-transfer-plugin
COPY --from=builder /vendure/packages/common ./packages/common
COPY --from=builder /vendure/packages/core ./packages/core
COPY --from=builder /vendure/packages/create ./packages/create
COPY --from=builder /vendure/packages/elasticsearch-plugin ./packages/elasticsearch-plugin
COPY --from=builder /vendure/packages/email-plugin ./packages/email-plugin
COPY --from=builder /vendure/packages/event-plugin ./packages/event-plugin
COPY --from=builder /vendure/packages/job-queue-plugin ./packages/job-queue-plugin
COPY --from=builder /vendure/packages/sale-plugin ./packages/sale-plugin
COPY --from=builder /vendure/packages/server ./packages/server
COPY --from=builder /vendure/packages/ui-devkit ./packages/ui-devkit
COPY --from=builder /vendure/packages/vnpay-plugin ./packages/vnpay-plugin

EXPOSE 3000
