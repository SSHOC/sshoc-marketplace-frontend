import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setValue] = useState(value)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue(value)
    }, delay)
    return () => {
      clearTimeout(timeout)
    }
  }, [value, delay])
  return debouncedValue
}
