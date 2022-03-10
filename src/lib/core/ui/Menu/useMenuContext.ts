import { useContext } from 'react'

import type { MenuContextValue } from '@/lib/core/ui/Menu/MenuContext'
import { MenuContext } from '@/lib/core/ui/Menu/MenuContext'
import { assert } from '@/lib/utils'

export function useMenuContext(): MenuContextValue {
  const value = useContext(MenuContext)

  assert(value != null)

  return value
}
