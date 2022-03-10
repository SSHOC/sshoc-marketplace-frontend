import { useEffect, useState } from 'react'

export interface UseDebouncedStateArgs<T> {
  value: T
  delay: number
}

export function useDebouncedState<T>(options: UseDebouncedStateArgs<T>): T {
  const { value, delay } = options

  const [debouncedState, setDebouncedState] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedState(value)
    }, delay)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [value, delay])

  return debouncedState
}
