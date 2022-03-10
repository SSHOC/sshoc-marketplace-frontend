import type { UseMutationOptions, UseMutationResult } from 'react-query'
import { useMutation } from 'react-query'

import type { Revalidate } from '@/lib/core/app/revalidate'
import { revalidate } from '@/lib/core/app/revalidate'

export function useRevalidate(
  options?: UseMutationOptions<Revalidate.Response, Error, Revalidate.Variables>,
): UseMutationResult<Revalidate.Response, Error, Revalidate.Variables> {
  return useMutation(({ data }: Revalidate.Variables) => {
    return revalidate(data)
  }, options)
}
