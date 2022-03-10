import { useRouter } from 'next/router'

import { useRoute } from '@/lib/core/navigation/useRoute'

export function useSearchParams(): URLSearchParams | null {
  const router = useRouter()
  const route = useRoute()

  if (!router.isReady) return null

  return route.searchParams
}
