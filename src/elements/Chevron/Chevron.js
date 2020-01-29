import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'

const rotate = {
  down: '0',
  left: '90',
  right: '270',
  up: '180',
}

const Chevron = ({ direction = 'down', ...props }) => (
  <svg
    aria-hidden
    css={css({
      transform: `rotate(${rotate[direction]}deg)`,
      transition: theme => `transform ${theme.transitions.default}`,
    })}
    height="1em"
    viewBox="0 0 16 16"
    width="1em"
    {...props}
  >
    <polyline
      fill="none"
      points="3 6 8 11 13 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    />
  </svg>
)

export default Chevron
