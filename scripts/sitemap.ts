import generate from '@stefanprobst/next-sitemap'
import { log } from '@/utils/log'
import { url as baseUrl } from '@@/config/metadata.json'

const robots = 'User-agent: *\nDisallow: /\n'

generate({ baseUrl, robots, shouldFormat: true })
  .then(() => log.success('Successfully generated sitemap.'))
  .catch(log.error)
