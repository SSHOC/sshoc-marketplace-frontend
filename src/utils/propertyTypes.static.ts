import type { ValLoaderResult } from '@stefanprobst/val-loader'

import { getPropertyTypes } from '@/api/sshoc'

/**
 * Retrieves allowed property-types at build-time, so we can filter out
 * property types which are unknown in a sshoc instance when populating
 * initial recommended form fields.
 */
export default async function load(): Promise<ValLoaderResult> {
  const result = await getPropertyTypes({}).then(({ propertyTypes }) => {
    return propertyTypes!.map((propertyType) => {
      return propertyType.code!
    })
  })

  return { cacheable: true, code: `export default ${JSON.stringify(result)}` }
}
