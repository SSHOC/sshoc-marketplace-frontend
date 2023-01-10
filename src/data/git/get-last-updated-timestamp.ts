import { log } from '@stefanprobst/log'
import { createUrl, request } from '@stefanprobst/request'

import { backend } from '~/config/cms.config'

async function getCommits(filePath: string) {
  const url = createUrl({
    baseUrl: 'https://api.github.com',
    pathname: `/repos/${backend.repo}/commits`,
    searchParams: { path: filePath },
  })

  return request(url, { responseType: 'json' })
}

export async function getLastUpdatedTimestamp(filePath: string): Promise<Date> {
  const commits = await getCommits(filePath)
  const [lastCommit] = commits
  const timestamp = lastCommit?.commit.committer.date

  if (timestamp == null) {
    log.warn('Failed to fetch last updated timestamp, using current date.')
    return new Date()
  }

  return new Date(timestamp)
}
