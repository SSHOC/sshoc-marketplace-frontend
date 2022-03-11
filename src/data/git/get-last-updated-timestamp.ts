import type { UrlSearchParamsInit } from '@stefanprobst/request'
import { createUrl, request } from '@stefanprobst/request'
import { posix } from 'path'

import { log } from '@/lib/utils'
import { backend } from '~/config/cms.config'

const gitlabBaseUrl = backend.auth.apiBaseUrl
const gitlabprojectId = backend.projectId
const gitlabBranch = process.env['NEXT_PUBLIC_GITLAB_REPOSITORY_CURRENT_BRANCH'] ?? backend.branch
const gitlabAccesToken = process.env['GITLAB_ACCESS_TOKEN']

function createGitlabApiRequest(pathname: string, searchParams?: UrlSearchParamsInit) {
  const url = createUrl({
    baseUrl: gitlabBaseUrl,
    pathname: posix.join('/api/v4/projects/', gitlabprojectId, encodeURIComponent(pathname)),
    searchParams: searchParams ?? {},
  })

  const request = new Request(String(url))

  if (gitlabAccesToken != null) {
    request.headers.set('PRIVATE-TOKEN', gitlabAccesToken)
  }

  return request
}

async function getLastCommitId(fileName: string): Promise<string> {
  const req = createGitlabApiRequest('repository/files/' + fileName, {
    ref: gitlabBranch,
  })
  const { last_commit_id: lastCommitId } = await request(req, { responseType: 'json' })
  return lastCommitId
}

async function getCommitTimestamp(sha: string): Promise<string> {
  const req = createGitlabApiRequest('repository/commits/' + sha)
  const { committed_date: commitTimestamp } = await request(req, { responseType: 'json' })
  return commitTimestamp
}

export async function getLastUpdatedTimestamp(filePath: string): Promise<Date> {
  if (gitlabAccesToken == null) {
    log.warn('No gitlab access token provided, using current timestamp.')
    return Promise.resolve(new Date())
  }

  const lastCommidId = await getLastCommitId(filePath)
  const commitTimestamp = await getCommitTimestamp(lastCommidId)

  return new Date(commitTimestamp)
}
