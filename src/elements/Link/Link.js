import css from '@styled-system/css'
import variant from '@styled-system/variant'
import styled from 'styled-components/macro'
import RelativeOrAbsoluteLink from '../../components/Link/Link'

const Link = styled(RelativeOrAbsoluteLink)(
  css({
    appearance: 'none',
    bg: 'transparent',
    border: 'none',
    color: 'primary',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    outline: 'none',
    p: 0,
    textDecoration: 'none',
    transition:
      'background-color 0.2s ease-out, box-shadow 0.2s ease-out, color 0.2s ease-out',
    '&:focus': {
      boxShadow: 'outline',
    },
    '&:hover': {
      color: 'primaryHover',
    },
    '&:active': {
      color: 'text',
    },
    '&[disabled]': {
      color: 'muted',
      pointerEvents: 'none',
    },
  }),
  variant({
    variants: {
      nav: {
        display: 'inline-block',
        fontSize: 3,
        textAlign: 'center',
      },
    },
  })
)

export default Link
