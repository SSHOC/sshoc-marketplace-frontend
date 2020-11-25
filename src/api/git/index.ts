import { posix } from 'path'
import { log } from '@/utils/log'

const gitlabBaseUrl = process.env.GITLAB_BASE_URL ?? 'https://gitlab.com'
const gitlabRepository = process.env.GITLAB_REPOSITORY
const gitlabBranch = process.env.GITLAB_BRANCH ?? 'main'
const gitlabAccesToken = process.env.GITLAB_ACCESS_TOKEN
const pagesFolder = posix.join('content', 'pages')

async function request(req: Request) {
  const response = await fetch(req)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

function createGitlabApiRequest(path: string, query?: Record<string, unknown>) {
  const url = new URL(
    posix.join(
      '/api/v4/projects/',
      encodeURIComponent(gitlabRepository as string),
      path,
    ),
    gitlabBaseUrl,
  )
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v != null) {
            url.searchParams.append(key, String(v))
          }
        })
      } else if (value != null) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  const request = new Request(String(url))
  if (gitlabAccesToken !== undefined) {
    request.headers.set('PRIVATE-TOKEN', gitlabAccesToken)
  }
  return request
}

export async function getLastCommitId(fileName: string): Promise<string> {
  const req = createGitlabApiRequest(
    'repository/files/' + encodeURIComponent(fileName),
    {
      ref: gitlabBranch,
    },
  )
  const { last_commit_id: lastCommitId } = await request(req)
  return lastCommitId
}

export async function getCommitTimestamp(sha: string): Promise<string> {
  const req = createGitlabApiRequest('repository/commits/' + sha)
  const { committed_date: commitTimestamp } = await request(req)
  return commitTimestamp
}

export async function getLastUpdatedTimestamp(pageId: string): Promise<Date> {
  if (gitlabBaseUrl === undefined) {
    log.warn(
      'No GitLab url provided in GITLAB_BASE_URL environment variable. Falling back to current date for "last updated" timestamps.',
    )
    return new Date()
  }
  if (gitlabRepository === undefined) {
    log.warn(
      'No GitLab repository name provided in GITLAB_REPOSITORY environment variable. Falling back to current date for "last updated" timestamps.',
    )
    return new Date()
  }
  const filePath = posix.join(pagesFolder, pageId + '.mdx')
  const lastCommidId = await getLastCommitId(filePath)
  const commitTimestamp = await getCommitTimestamp(lastCommidId)
  return new Date(commitTimestamp)
}
