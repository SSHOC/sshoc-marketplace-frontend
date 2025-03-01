# Contributing to SSH Open Marketplace Frontend

Thank you for your interest in contributing to the SSH Open Marketplace frontend application. This
document provides guidelines and information to help you get started.

## Project Overview

The SSH Open Marketplace is a discovery portal for Social Sciences and Humanities resources. The
frontend is built with:

- **Next.js 13** using the traditional "pages router" with React 18
- **TypeScript 4** for type safety
- **React Query 3** for data fetching, caching, and request de-duplication
- **Node.js 22** Runtime environment
- **Yarn 1** as package manager
- **Netlify CMS** for content management

## Architecture

### Core Components

1. **Pages**: Located in `src/pages/`, following Next.js conventions. Pages are organized by
   feature/domain (e.g., workflow, training-material, auth, contribute, about).

2. **Components**: Shared UI components in `src/components/`, organized by feature/domain.

3. **Data Layer**:

   - API client and types for requests/responses in `src/data/sshoc/api/`
   - React Query hooks in `src/data/sshoc/hooks/`
   - Type definitions shared across the application.

4. **CMS Integration**:
   - CMS configuration in `src/lib/cms/`
   - Content collections defined in `src/lib/cms/collections/`
   - Authentication is handled via GitHub OAuth. The OAuth

## Development Workflow

### Set up local dev environment

1. Install dependencies

```bash
yarn install
```

2. Create local .env file

```
echo "NEXT_PUBLIC_SSHOC_API_BASE_URL=https://sshoc-marketplace-api.acdh-dev.oeaw.ac.at" > .env.development.local
```

3. Start development server

```
yarn run dev
```

### Deployment

Merges to `main` trigger automatic deployments

Three environments are available:

- Development: `https://sshoc-marketplace.acdh-dev.oeaw.ac.at`
- Staging: `https://sshoc-marketplace-stage.acdh-dev.oeaw.ac.at`
- Production: `https://marketplace.sshopencloud.eu`

There is no difference in frontend code between these environments, but they talk to different
backend instances.

## Environment variables

- `NEXT_PUBLIC_BASE_URL`: base url of the deployment domain
- `NEXT_PUBLIC_SSHOC_API_BASE_URL`: base url of the backend api
- `REVALIDATION_TOKEN`: secret for revalidating next.js routes. you can generate one with
  `openssl rand -hex 16`
- `NEXT_PUBLIC_MOCK_API`: whether api mocking is enabled. allowed values are "disabled" and
  "enabled". when "enabled" any http requests to the backend api will be intercepted by a service
  worker (`msw`), and return dummy content generated with `@faker-js/faker`
- `NEXT_PUBLIC_LOCAL_CMS_BACKEND`: whether the cms should write changes to the local filesystem
  ("enabled"), or try to commit changes to GitHub ("disabled")
- `NEXT_PUBLIC_GITHUB_REPOSITORY`, `NEXT_PUBLIC_GITHUB_REPOSITORY_BRANCH`, `OAUTH_PROVIDER`,
  `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, `OAUTH_REDIRECT_URL`, `OAUTH_ALLOWED_ORIGIN` are needed
  to the CMS OAuth flow. in local development you should not need these
- `NEXT_PUBLIC_MATOMO_BASE_URL` and `NEXT_PUBLIC_MATOMO_APP_ID` to configure Matomo analytics
- `NEXT_PUBLIC_GOOGLE_SITE_ID`: Google Search Console verification token
- `SMTP_SERVER`, `SMTP_PORT`, `SSHOC_CONTACT_EMAIL_ADDRESS`: smtp server configuration required by
  the contact form

## Naming Conventions

### Files and Folders

- React components: PascalCase (e.g., `WorkflowForm.tsx`)
- Hooks: camelCase prefixed with 'use' (e.g., `useWorkflowForm.ts`)
- Pages: kebab-case with `.tsx` extension
- Content pages: kebab-case with `.mdx` extension
- Test files: Same name as tested file with `.test.ts` extension

### Component Conventions

- Props interfaces should be named `{ComponentName}Props`
- Hooks should be typed with generics where appropriate
- Export types and interfaces alongside their components

### Code Style

- Use TypeScript for all new code
- Follow existing patterns for React Query usage
- Use functional components with hooks
- Use markdown for content pages

## API

Everything related to communicating with the SSHOC marketplace backend is located in
[src/data/sshoc](./src/data/sshoc).

## Role-Based Access

The application implements role-based access with three main roles:

- Administrator
- Moderator
- Contributor

Access control is implemented through the `isPageAccessible` function on page components. Reference
existing implementations when adding new protected routes.

## Content Management

The application uses Netlify CMS for content management. Content is managed through markdown files
and the [CMS configuration](`src/lib/cms/cms.config.ts`) defines the available fields and
collections.
