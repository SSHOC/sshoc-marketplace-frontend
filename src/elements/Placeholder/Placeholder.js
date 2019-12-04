import React from 'react'
import styled, { keyframes } from 'styled-components/macro'

const pulsate = keyframes({
  from: {
    opacity: 0,
  },
  '40%': {
    opacity: 0.3,
  },
  '60%': {
    opacity: 0.3,
  },
  to: {
    opacity: 0,
  },
})

const PlaceholderHeading = props => (
  <svg width="250" height="55" {...props}>
    <rect
      fill="currentColor"
      rx="3"
      ry="3"
      x="0"
      y="0"
      width="100%"
      height="20"
    />
  </svg>
)

const PlaceholderIcon = props => (
  <svg width="45" height="45" {...props}>
    <rect
      fill="currentColor"
      x="0"
      y="0"
      rx="3"
      ry="3"
      width="100%"
      height="100%"
    />
  </svg>
)

const PlaceholderText = props => (
  <svg width="100%" height="75" {...props}>
    <rect
      fill="currentColor"
      x="0"
      y="0"
      rx="3"
      ry="3"
      width="90%"
      height="6"
    />
    <rect
      fill="currentColor"
      x="0"
      y="20"
      rx="3"
      ry="3"
      width="100%"
      height="6"
    />
    <rect
      fill="currentColor"
      x="0"
      y="40"
      rx="3"
      ry="3"
      width="60%"
      height="6"
    />
  </svg>
)

const AnimatedPlaceholderHeading = styled(PlaceholderHeading)`
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-name: ${pulsate};
  display: block;
`

const AnimatedPlaceholderIcon = styled(PlaceholderIcon)`
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-name: ${pulsate};
  display: block;
`

const AnimatedPlaceholderText = styled(PlaceholderText)`
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-name: ${pulsate};
  display: block;
`

const Placeholder = {
  Heading: AnimatedPlaceholderHeading,
  Icon: AnimatedPlaceholderIcon,
  Text: AnimatedPlaceholderText,
}

export default Placeholder
