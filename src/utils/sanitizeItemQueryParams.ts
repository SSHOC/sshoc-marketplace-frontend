import type { GetServerSidePropsContext } from 'next'

import { ensureScalar } from '@/utils/ensureScalar'

export function sanitizeItemQueryParams(
  params: GetServerSidePropsContext['params'],
): { id?: string } {
  if (params === undefined || params.id === undefined) return {}
  const id = ensureScalar(params.id)
  return { id }
}
