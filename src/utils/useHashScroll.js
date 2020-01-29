import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useHashScroll = () => {
  const location = useLocation()

  useEffect(() => {
    const id = location.hash?.slice(1)
    if (id) {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        element.focus()
      }
    }
  }, [location.hash])
}
