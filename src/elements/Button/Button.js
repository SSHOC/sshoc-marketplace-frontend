import css from '@styled-system/css'
import variant from '@styled-system/variant'
import styled from 'styled-components/macro'

const Button = styled('button')(
  css({
    alignItems: 'center',
    appearance: 'none',
    bg: 'background',
    borderColor: 'border',
    borderRadius: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'text',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'body',
    fontSize: 2,
    justifyContent: 'space-between',
    lineHeight: 'body',
    px: 3,
    py: 2,
    textDecoration: 'none',
    transition:
      'background-color 0.2s ease-out, box-shadow 0.2s ease-out, color 0.2s ease-out',
    whiteSpace: 'nowrap',
    '&:focus': {
      boxShadow: 'outline',
      outline: 'none',
    },
    '&:hover': {
      bg: 'subtler',
      color: 'primary',
    },
    '&:active': {
      bg: 'subtler',
      color: 'text',
    },
    '&[disabled]': {
      color: 'subtle',
      pointerEvents: 'none',
    },
  }),
  variant({
    variants: {
      fancy: {
        backgroundImage: theme => theme.gradients.primary,
        bg: 'primaryHover',
        color: 'subtlest',
        '&:hover': {
          backgroundImage: 'none',
          bg: 'primaryHover',
          color: 'subtlest',
        },
        '&:active': {
          backgroundImage: 'none',
          bg: 'primaryActive',
          color: 'subtlest',
        },
      },
      primary: {
        bg: 'primary',
        borderColor: 'primary',
        color: 'subtlest',
        '&:hover': {
          bg: 'primaryHover',
          borderColor: 'primaryHover',
          color: 'subtlest',
        },
        '&:active': {
          bg: 'primaryActive',
          borderColor: 'primaryActive',
          color: 'subtlest',
        },
      },
    },
  }),
  variant({
    prop: 'size',
    variants: {
      large: {
        fontSize: 3,
      },
      small: {
        fontSize: 1,
        lineHeight: 'small',
      },
    },
  })
)

Button.defaultProps = {
  type: 'button',
}

export default Button
