# build
FROM node:10-alpine as build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn --silent

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY src ./src
COPY public ./public
RUN yarn build

# serve
FROM node:10-alpine

COPY --from=build /usr/src/app/build /usr/share/app

EXPOSE 3000

CMD ["npx", "serve", "-s", "-n", "-l", "3000", "/usr/share/app"]
