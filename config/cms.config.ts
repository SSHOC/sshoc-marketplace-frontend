export { baseUrl as siteUrl } from '~/config/site.config'

export const useLocalBackend = process.env['NEXT_PUBLIC_LOCAL_CMS_BACKEND'] === 'enabled'

const repo = process.env['NEXT_PUBLIC_GITLAB_REPOSITORY'] ?? 'sshoc/sshoc-marketplace-frontend'
const branch = process.env['NEXT_PUBLIC_GITLAB_REPOSITORY_BRANCH'] ?? 'develop'
const apiBaseUrl = process.env['NEXT_PUBLIC_GITLAB_BASE_URL'] ?? 'https://gitlab.gwdg.de'
const apiRoot = String(new URL('/api/v4', apiBaseUrl))
const appId =
  process.env['NEXT_PUBLIC_GITLAB_APP_ID'] ??
  '715dbe5a99099c436330e3fe439ac38e2c746fbdefc4446558fe6f99c517b8d7'

export const backend = {
  provider: 'gitlab' as const,
  repo,
  branch,
  isPublic: true,
  auth: {
    type: 'implicit' as const,
    apiBaseUrl,
    apiRoot,
    endpoint: 'oauth/authorize',
    appId,
  },
}

export const logo = '/assets/images/logo-with-text.svg'
