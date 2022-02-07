# SSHOC Marketplace

Client for the [SSHOC Marketplace](https://marketplace.sshopencloud.eu).

## Prerequisites

You need [`node`](https://nodejs.org/en/download/) and
[`yarn`](https://classic.yarnpkg.com/en/docs/install) installed.

## Development

Before starting the first time, build an API client with `yarn create:sshoc-client`. Start the
development server with `yarn dev` and visit [http://localhost:3000](http://localhost:3000).
Optionally, start a local CMS backend with `yarn dev:cms` and access the CMS at
[http://localhost:3000/admin/index.html](http://localhost:3000/admin/index.html).

## Production

Produce a production build with `yarn build` and run the server with `yarn start`.

### Environment variables

To configure the build via environment variables, copy `.env.local.example` to `.env.production` or
`.env.local`. A `.env.local` config will _not_ be committed to git, while
`.env.{development,production}` will. _Note:_ When using an `.env` file to configure
`docker-compose`, be aware that values in `.env` take precedence over values in `.env.local`.

- `SSHOC_OPENAPI_DOCUMENT_URL` should point to the OpenAPI document for the SSHOC Marketplace API.
  Defaults to `http://localhost:8080/v3/api-docs`.
- `GITLAB_BASE_URL` and `GITLAB_REPOSITORY` should point to the frontend repository. This will be
  used to get "last updated" timestamps for static content pages. When not provided, timestamps will
  fall back to the current date at build time.
- `NEXT_PUBLIC_SSHOC_BASE_URL` and `NEXT_PUBLIC_SSHOC_API_BASE_URL` should point to frontend and
  backend.
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` for ReCaptcha.
- `NEXT_PUBLIC_MATOMO_BASE_URL` and `NEXT_PUBLIC_MATOMO_SITE_ID` for analytics.

### Performance metrics

Currently, [performance metrics](https://nextjs.org/docs/advanced-features/measuring-performance)
are logged to the console. Consider editing `src/pages/_app.tsx` to send them to an analytics
service.

### Page metadata

Site metadata can be configured in `config/metadata.json`.

## Static page content

Static content for the Home page, About pages, Contact page, and Privacy policy page can be edited
on [/admin/index.html](http://localhost:3000/admin/index.html).

## Docker

You can build a container with `docker-compose build`, and run locally with `docker-compose up`,
then visit [http://localhost:3000](http://localhost:3000). Build configuration should be provided
via `.env` file (see `.env.local.example`).

In order to run both backend and frontend locally with docker, the frontend container must be able
to reach the backend container network at runtime. You can run
`docker-compose -f docker-compose.local.yml up --build` (assuming the backend container network is
up with its default name `sshoc-marketplace-backend_default`).
