import { useCallback, useState } from 'react'

/** JSON serializable */
type Json = null | boolean | string | number | Json[] | { [key: string]: Json }

type ValueOrSetter<T> = T | ((previousValue: T) => T)

export function useLocalStorage<T extends Json>(
  key: string,
  initialValue: T,
): [T, (value: ValueOrSetter<T>) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) return initialValue
      return JSON.parse(item)
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = useCallback(
    function setValue(value: ValueOrSetter<T>) {
      try {
        /** mirror useState api */
        const newValue =
          typeof value === 'function' ? value(storedValue) : value
        window.localStorage.setItem(key, JSON.stringify(newValue))
        setStoredValue(newValue)
      } catch (error) {
        console.error(error)
      }
    },
    [key, storedValue],
  )

  return [storedValue, setValue]
}
