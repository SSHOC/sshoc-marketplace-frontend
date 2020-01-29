# build
FROM node:10-alpine as build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile --production --silent

ENV PATH /usr/src/app/node_modules/.bin:${PATH}

ARG REACT_APP_API_BASE_URL

COPY src ./src
COPY public ./public
RUN yarn build

# serve
FROM node:10-alpine

COPY serve.json /usr/share
COPY --from=build /usr/src/app/build /usr/share/app

EXPOSE 3000

USER node

CMD ["npx", "serve", "-c", "/usr/share/serve.json", "-l", "3000", "-n", "-s", "/usr/share/app"]
