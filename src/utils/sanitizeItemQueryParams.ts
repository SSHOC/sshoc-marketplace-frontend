import type { GetServerSidePropsContext } from 'next'
import { ensureScalar } from '@/utils/ensureScalar'

export function sanitizeItemQueryParams(
  params: GetServerSidePropsContext['params'],
): { id?: number } {
  if (params === undefined || params.id === undefined) return {}
  const id = parseInt(ensureScalar(params.id), 10)
  if (Number.isNaN(id) || id <= 0) return {}
  return { id }
}
