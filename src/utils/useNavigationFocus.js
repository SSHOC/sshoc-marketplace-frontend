import { useEffect, createRef } from 'react'

// TODO: Check if we can drop this once react-router v6 is released
export const useNavigationFocus = () => {
  const ref = createRef()

  useEffect(() => {
    if (ref.current) {
      ref.current.focus({ preventScroll: true })
    }
  }, [ref])

  return ref
}
