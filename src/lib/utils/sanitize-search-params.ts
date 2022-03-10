import { isEmptyArray, isEmptyString } from '@/lib/utils'
import { defaultItemSearchResultsSortOrder } from '~/config/sshoc.config'

export function sanitizeSearchParams<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      if (value == null) return false
      if (isEmptyArray(value)) return false
      if (isEmptyString(value)) return false

      if (key === 'page' && value === 1) return false
      if (key === 'order' && value === defaultItemSearchResultsSortOrder) return false

      return true
    }),
  ) as T
}
