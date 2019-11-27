import css from '@styled-system/css'
import variant from '@styled-system/variant'
import styled from 'styled-components/macro'
import RelativeOrAbsoluteLink from '../../components/Link/Link'

const Link = styled(RelativeOrAbsoluteLink)(
  css({
    appearance: 'none',
    bg: 'transparent',
    border: 'none',
    borderBottomColor: 'transparent',
    borderBottomStyle: 'solid',
    borderBottomWidth: 2,
    color: 'primary',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    outline: 'none',
    p: 0,
    textDecoration: 'none',
    transition: 'border-bottom-color 0.2s ease-out, box-shadow 0.2s ease-out',
    '&:focus': {
      boxShadow: 'outline',
    },
    '&:hover': {
      borderBottomColor: 'currentColor',
    },
    '&:active': {
      color: 'text',
    },
  }),
  variant({
    variants: {
      nav: {
        borderBottomStyle: 'none',
        display: 'inline-block',
      },
    },
  })
)

export default Link
