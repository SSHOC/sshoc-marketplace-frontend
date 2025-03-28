# sshoc marketplace frontend

frontend for the social sciences & humanities open marketplace.

## how to run

prerequisites:

- [node.js v22](https://nodejs.org/en/download)
- [pnpm v10](https://pnpm.io/installation)

> [!TIP]
>
> you can use `pnpm` to install the required node.js version with `pnpm env use 22 --global`

set required environment variables in `.env.local`:

```bash
cp .env.local.example .env.local
```

when adding new environment variables, don't forget to add them to
[`.env.local.example`](./.env.local.example) and [`config/env.config.ts`](./config/env.config.ts),
as well as the [validation](./.github/workflows/validate.yml) and
[deployment](./.github/workflows/build-deploy.yml) github workflows. use
["variables"](https://github.com/sshoc/sshoc-marketplace-frontend/settings/variables/actions) for
every environment variable prefixed with `NEXT_PUBLIC_`, and
["secrets"](https://github.com/sshoc/sshoc-marketplace-frontend/settings/secrets/actions) for all
others.

install dependencies:

```bash
pnpm install
```

run a development server on [http://localhost:3000](http://localhost:3000):

```bash
pnpm run dev
```

> [!TIP]
>
> this template supports developing in containers. when opening the project in your editor, you
> should be prompted to re-open it in a devcontainer.

## how to test

generate a production build and run end-to-end tests with:

```bash
pnpm run build
pnpm run test:e2e
```

visual snapshot tests should be run in the template's devcontainer - or a comparable debian bookworm
based linux environment -, and can be updated with:

```bash
pnpm run test:e2e:update-snapshots
```
