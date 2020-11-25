FROM node:14-alpine

WORKDIR /usr/src/app

# git is needed for openapi-ts-client
RUN apk update && apk upgrade && apk add --no-cache git

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --quiet

COPY . .
ARG NEXT_TELEMETRY_DISABLED=1
ARG GITLAB_BASE_URL
ARG GITLAB_REPOSITORY
ARG GITLAB_REPOSITORY_BRANCH
ARG GITLAB_ACCESS_TOKEN
ARG SSHOC_OPENAPI_DOCUMENT_URL
ARG NEXT_PUBLIC_SSHOC_BASE_URL
ARG NEXT_PUBLIC_SSHOC_API_BASE_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_MATOMO_BASE_URL
ARG NEXT_PUBLIC_MATOMO_SITE_ID
RUN yarn build

EXPOSE 3000

USER node

# run docker with --init flag to handle SIGTERM/SIGKILL
CMD ["yarn", "start"]
