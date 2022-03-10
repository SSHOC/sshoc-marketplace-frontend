import { useContext } from 'react'

import type { ApiParamsContextValue } from '@/components/documentation/ApiParamsContext'
import { ApiParamsContext } from '@/components/documentation/ApiParamsContext'
import { assert } from '@/lib/utils'

export function useApiParams(): ApiParamsContextValue {
  const value = useContext(ApiParamsContext)

  assert(value != null)

  return value
}
