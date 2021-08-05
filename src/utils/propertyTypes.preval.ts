import preval from 'next-plugin-preval'

import { getPropertyTypes } from '@/api/sshoc'

/**
 * Retrieves allowed property-types at build-time, so we can filter out
 * property types which are unknown in a sshoc instance when populating
 * initial recommended form fields.
 */
export default preval(
  getPropertyTypes({}).then(({ propertyTypes }) => {
    return propertyTypes!.map((propertyType) => propertyType.code)
  }),
)
