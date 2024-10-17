# base
FROM node:22-slim AS base

RUN corepack enable

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node package.json pnpm-lock.yaml ./

# cannot use `--ignore-scripts` for `sharp` to compile
RUN pnpm install --frozen-lockfile

# build
FROM base AS build

RUN pnpm install --frozen-lockfile --ignore-scripts --offline

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

# @see https://docs.docker.com/build/ci/github-actions/examples/#secrets
# docker buildkit currently cannot mount secrets directly to env vars
# @see https://github.com/moby/buildkit/issues/2122
USER root
RUN --mount=type=secret,id=github_token \
  export GITHUB_TOKEN="$(cat /run/secrets/github_token)" && \
  pnpm build && \
  unset GITHUB_TOKEN
USER node

# serve
FROM node:22-slim AS serve

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
