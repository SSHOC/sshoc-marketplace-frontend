import type { ValLoaderResult } from '@stefanprobst/val-loader'

import type { PropertyType } from '@/data/sshoc/api/property'
import { getPropertyTypes } from '@/data/sshoc/api/property'
import { mapBy } from '@/lib/utils'

export type StaticResult = Record<PropertyType['code'], PropertyType>

export default async function load(): Promise<ValLoaderResult> {
  const data = await getPropertyTypes({ perpage: 100 })
  const propertyTypesById = Object.fromEntries(mapBy(data.propertyTypes, 'code'))

  return {
    cacheable: true,
    code: `export default ${JSON.stringify(propertyTypesById)}`,
  }
}
