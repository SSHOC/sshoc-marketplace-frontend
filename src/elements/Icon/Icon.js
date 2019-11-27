import React, { forwardRef } from 'react'

const getPath = icon => {
  switch (icon) {
    case 'moon':
      return (
        <path
          d="M21.4,13.7C20.6,13.9,19.8,14,19,14c-5,0-9-4-9-9c0-0.8,0.1-1.6,0.3-2.4c0.1-0.3,0-0.7-0.3-1 c-0.3-0.3-0.6-0.4-1-0.3C4.3,2.7,1,7.1,1,12c0,6.1,4.9,11,11,11c4.9,0,9.3-3.3,10.6-8.1c0.1-0.3,0-0.7-0.3-1 C22.1,13.7,21.7,13.6,21.4,13.7z"
          fill="currentColor"
        />
      )

    case 'sun':
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="full"
          strokeLinejoin="full"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2" />
          <path d="M12 21v2" />
          <path d="M4.22 4.22l1.42 1.42" />
          <path d="M18.36 18.36l1.42 1.42" />
          <path d="M1 12h2" />
          <path d="M21 12h2" />
          <path d="M4.22 19.78l1.42-1.42" />
          <path d="M18.36 5.64l1.42-1.42" />
        </g>
      )

    default:
      return null
  }
}

const Icon = forwardRef(({ icon, ...props }, ref) => {
  const path = getPath(icon)

  return (
    <svg height="1em" ref={ref} viewBox="0 0 24 24" width="1em" {...props}>
      {path}
    </svg>
  )
})

export default Icon
