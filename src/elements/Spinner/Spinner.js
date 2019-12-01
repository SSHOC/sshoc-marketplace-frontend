import React from 'react'
import styled, { keyframes } from 'styled-components/macro'

const rotate = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)',
  },
})

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  '50%': {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

const Donut = props => (
  <svg
    aria-busy
    aria-live="polite"
    fill="none"
    fillRule="evenodd"
    height="1em"
    stroke="currentColor"
    strokeWidth="3"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <circle strokeOpacity=".5" cx="12" cy="12" r="10" />
    <path d="M 12 22 A 10 10 0 0 0 22 12"></path>
    {/* <circle
      cx="12"
      cy="12"
      r="10"
      strokeDasharray={2 * 10 * Math.PI}
      strokeDashoffset={2 * 10 * Math.PI * (3 / 4)}
    /> */}
  </svg>
)

const Spinner = styled(Donut)`
  animation-name: ${rotate}, ${fadeIn};
  animation-duration: 0.5s, 3s;
  animation-iteration-count: infinite, 1;
  animation-timing-function: linear;
`

export default Spinner
