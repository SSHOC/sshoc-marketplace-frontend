# sshoc frontend

web frontend for the social sciences & humanities open marketplace

## how to run

prerequisites:

- [Node.js v20](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/installation)

set required environment variables in `.env.local`:

```bash
cp .env.example .env.local
```

adjust environment variables in `.github/workflows/validate.yml`.

install dependencies:

```bash
pnpm install
```

run a development server on [http://localhost:3000](http://localhost:3000):

```bash
pnpm run dev
```
