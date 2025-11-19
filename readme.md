# sshoc-marketplace-frontend

frontend application for the sshoc open marketplace.

## prerequisites

- [node.js 24.x](https://nodejs.org/de/download)
- [pnpm 10.x](https://pnpm.io/installation)

## how to run locally

install dependencies:

```bash
pnpm install
```

if you don't plan to run a backend instance locally, create a `.env.local` file, and configure the
api base url:

```
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://sshoc-marketplace-api.acdh-dev.oeaw.ac.at
```

run a local development server on [http://localhost:3000](http://localhost:3000):

```bash
pnpm run dev
```

## how to deploy

every commit to the `main` branch will trigger a github action, which will create three deployments
to the acdh cluster:

- `production` on [https://marketplace.sshopencloud.eu](https://marketplace.sshopencloud.eu), using
  the backend at [https://marketplace-api.sshopencloud.eu](https://marketplace-api.sshopencloud.eu)
- `stage` on
  [https://sshoc-marketplace-stage.acdh-dev.oeaw.ac.at](https://sshoc-marketplace-stage.acdh-dev.oeaw.ac.at)
  using the backend at
  [https://sshoc-marketplace-api-stage.acdh-dev.oeaw.ac.at](https://sshoc-marketplace-api-stage.acdh-dev.oeaw.ac.at)
- `dev` on
  [https://sshoc-marketplace.acdh-dev.oeaw.ac.at](https://sshoc-marketplace.acdh-dev.oeaw.ac.at)
  using the backend at
  [https://sshoc-marketplace-api.acdh-dev.oeaw.ac.at](https://sshoc-marketplace-api.acdh-dev.oeaw.ac.at)
