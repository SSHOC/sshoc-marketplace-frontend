import { useEffect, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

export const useNavigationFocusScroll = () => {
  const history = useHistory()
  const location = useLocation()
  const ref = useRef()
  const isRouteChange = useRef(true)

  useEffect(() => {
    // Let the browser manage scroll position for backward/forward nav
    if (history.action === 'POP') return

    // Always reset scroll position on route change
    if (isRouteChange.current) {
      window.scrollTo(0, 0)
      isRouteChange.current = false
    }

    const id = location.hash?.slice(1)
    const element = id ? document.getElementById(id) : ref.current

    if (element) {
      element.focus({ preventScroll: true })
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      document.body.focus({ preventScroll: true })
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }
  }, [history, location.hash])

  return ref
}
