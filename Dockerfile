# base
FROM node:16-slim AS base

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node package.json yarn.lock ./

# cannot use `--ignore-scripts` for `sharp` to compile
RUN yarn install --frozen-lockfile --silent --production && yarn cache clean

# build
FROM base AS build

RUN yarn install --frozen-lockfile --ignore-scripts --silent --prefer-offline

COPY --chown=node:node tsconfig.json app.d.ts next-env.d.ts next.config.mjs ./
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node config ./config
COPY --chown=node:node public ./public
COPY --chown=node:node src ./src

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_SSHOC_API_BASE_URL
ARG NEXT_PUBLIC_MOCK_API
ARG NEXT_PUBLIC_BOTS
ARG NEXT_PUBLIC_MATOMO_BASE_URL
ARG NEXT_PUBLIC_MATOMO_APP_ID
ARG NEXT_PUBLIC_GOOGLE_SITE_ID
ARG NEXT_PUBLIC_LOCAL_CMS_BACKEND
ARG NEXT_PUBLIC_GITHUB_REPOSITORY
ARG NEXT_PUBLIC_GITHUB_REPOSITORY_BRANCH

# docker buildkit currently cannot mount secrets directly to env vars
# @see https://github.com/moby/buildkit/issues/2122
USER root
RUN --mount=type=secret,id=github_token \
  export GITHUB_TOKEN="$(cat /run/secrets/github_token)" && \
  yarn build && \
  unset GITHUB_TOKEN
USER node

# serve
FROM node:16-slim AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=build --chown=node:node /app/next.config.mjs ./
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

# Ensures folder is owned by node:node when mounted as volume.
RUN mkdir -p /app/.next/cache/images

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
