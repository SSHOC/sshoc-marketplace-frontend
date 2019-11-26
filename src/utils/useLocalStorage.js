import { useState } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = window.localStorage.getItem(key)
      return storedValue ? JSON.parse(storedValue) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setAndStoreValue = newValue => {
    const computedValue =
      typeof newValue === 'function' ? newValue(value) : newValue

    try {
      window.localStorage.setItem(key, JSON.stringify(computedValue))
    } catch (error) {
      console.error(error)
    }

    setValue(computedValue)
  }

  return [value, setAndStoreValue]
}
