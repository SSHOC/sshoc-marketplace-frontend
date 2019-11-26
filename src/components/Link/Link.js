import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

const isAbsoluteURL = url => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const Link = React.forwardRef(({ children, href, to, ...props }, ref) => {
  const destination = href || to

  if (isAbsoluteURL(destination)) {
    return (
      <a
        href={destination}
        ref={ref}
        rel="noopener noreferrer"
        target="_blank"
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <RouterLink ref={ref} to={destination} {...props}>
      {children}
    </RouterLink>
  )
})

export default Link
