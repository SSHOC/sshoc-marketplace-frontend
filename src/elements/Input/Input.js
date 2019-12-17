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
    px: 3,
    py: 2,
    transition: 'background-color 0.2s ease-out, box-shadow 0.2s ease-out',
    '&::placeholder': {
      color: 'muted',
    },
    '&:focus': {
      boxShadow: 'outline',
      outline: 'none',
      zIndex: 'focus',
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
