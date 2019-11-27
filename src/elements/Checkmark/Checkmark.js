import React from 'react'

const Checkmark = props => (
  <svg aria-hidden height="1em" viewBox="0 0 16 16" width="1em" {...props}>
    <polyline
      fill="none"
      points="3 7 6 11 14 4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    />
  </svg>
)

export default Checkmark
