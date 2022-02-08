import { log } from '@stefanprobst/log'
/* @ts-expect-error TypeScript does not yet support non-root package exports. */
// eslint-disable-next-line import/no-unresolved
import { generate } from '@stefanprobst/next-route-manifest/generate'

import { routeManifestConfig } from '~/next.config.mjs'

generate(routeManifestConfig)
  .then(() => {
    return log.success('Successfully generated route manifest.')
  })
  .catch(() => {
    log.error('Failed to generate route manifest.')
  })
