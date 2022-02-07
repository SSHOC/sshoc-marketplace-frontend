import { useCallback, useEffect, useState } from 'react'

import { JSON } from '@/utils/ts/json'

type ValueOrSetter<T> = T | ((previousValue: T) => T)

/**
 * Synchronizes state to local storage.
 */
export function useLocalStorage<T extends JSON>(
  key: string,
  initialValue: T,
  onChange?: () => void,
): [T, (value: ValueOrSetter<T>) => void, boolean] {
  const [storedValue, _setStoredValue] = useState<T>(initialValue)
  const [hasCheckedLocalStorage, setHasCheckedLocalStorage] = useState(false)

  const setStoredValue = useCallback(
    function setStoredValue(value: ValueOrSetter<T>) {
      _setStoredValue(value)
      onChange?.()
    },
    [onChange],
  )

  useEffect(() => {
    const item = getItem(key)

    if (item !== undefined) {
      setStoredValue(item)
    }

    setHasCheckedLocalStorage(true)
  }, [key, setStoredValue])

  const setValue = useCallback(
    function setValue(value: ValueOrSetter<T>) {
      setStoredValue((previousValue) => {
        const newValue = typeof value === 'function' ? value(previousValue) : value

        setItem(key, newValue)
        setStoredValue(newValue)

        return newValue
      })
    },
    [key, setStoredValue],
  )

  return [storedValue, setValue, hasCheckedLocalStorage]
}

/**
 * Retrieves and parses value from local storage.
 */
function getItem(key: string) {
  try {
    const item = window.localStorage.getItem(key)
    if (item === null) return undefined
    return JSON.parse(item)
  } catch {
    return undefined
  }
}

/**
 * Saves value to local storage.
 */
function setItem(key: string, value: unknown) {
  try {
    if (value == null) {
      window.localStorage.removeItem(key)
    } else {
      const item = JSON.stringify(value)
      window.localStorage.setItem(key, item)
    }
  } catch {
    /** Dont't set anything when local storage not supported. */
  }
}
