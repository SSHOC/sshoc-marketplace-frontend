import React from 'react'
import 'styled-components/macro'

const rotate = {
  down: '0',
  left: '90',
  right: '270',
  up: '180',
}

const Triangle = ({ direction = 'down', ...props }) => (
  <svg
    aria-hidden
    css={{
      transform: `rotate(${rotate[direction]}deg)`,
      transition: 'transform 0.2s ease-out',
    }}
    height="1em"
    viewBox="0 0 16 16"
    width="1em"
    {...props}
  >
    <polygon fill="currentColor" points="3 6 8 11 13 6" stroke="none" />
  </svg>
)

export default Triangle
