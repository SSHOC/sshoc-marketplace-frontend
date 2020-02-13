import css from '@styled-system/css'
import styled from 'styled-components/macro'

const Input = styled('input')(
  css({
    bg: 'background',
    borderColor: 'border',
    borderRadius: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'text',
    fontFamily: 'body',
    fontSize: 3,
    minWidth: 0,
    px: 3,
    py: 2,
    transition: theme =>
      [
        `background-color ${theme.transitions.default}`,
        `box-shadow ${theme.transitions.default}`,
      ].join(', '),
    '&::placeholder': {
      color: 'muted',
    },
    '&:focus': {
      outline: 'none',
      zIndex: 'focus',
    },
    '&:focus.focus-visible': {
      boxShadow: 'outline',
    },
    '&:hover': {
      bg: 'subtler',
    },
    '&:invalid, &:required': {
      borderColor: 'highlight',
    },
    '&[disabled]': {
      color: 'subtle',
      pointerEvents: 'none',
    },
    '&[disabled]::placeholder': {
      color: 'subtle',
    },
  })
)

export default Input
