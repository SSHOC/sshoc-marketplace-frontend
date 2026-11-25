# sshoc-marketplace-frontend

frontend application for the sshoc open marketplace.

## prerequisites

- [node.js 26.x](https://nodejs.org/de/download)
- [pnpm 12.x](https://pnpm.io/installation)

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

## svg icons

Icon components are committed as `.tsx` files in `lib/core/ui/icons`, with a comment identifying
the original SVG source. Keep the SVG files when editing or replacing an icon, and update its
React component too. Logos and backgrounds remain ordinary SVG image imports.

Development and production builds use Turbopack. `pnpm run build:app` also runs the native
TypeScript check and fails if it reports errors. `pnpm run analyze` uses Webpack for the bundle analyzer.
Development uses Next.js's default browser targets to avoid the `next/font` transform issue with
`last 1` Browserslist queries (https://github.com/vercel/next.js/issues/86792).

## tooling

- `pnpm test` / `pnpm test:watch`: run the [form upgrade baseline](tests/forms/readme.md).
- `pnpm test:e2e`: run the local-backend browser baseline with test credentials supplied at runtime.

- `pnpm run format:check` / `pnpm run format:fix`: format with Oxfmt, including import and Tailwind class sorting.
- `pnpm run lint:check` / `pnpm run lint:fix`: run Oxlint and Stylelint 18.
- `pnpm run types:check`: check types with TypeScript 7. Oxlint also checks types.

`pnpm install` installs Lefthook's pre-commit hook outside CI. The hook fixes staged files with
Oxlint, Stylelint, and Oxfmt, and stages the fixes. Use the recommended Oxc VS Code extension for
formatting and linting in the editor.

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
