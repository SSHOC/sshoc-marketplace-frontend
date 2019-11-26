import css from '@styled-system/css'
import styled from 'styled-components/macro'
import RelativeOrAbsoluteLink from '../../components/Link/Link'

const Link = styled(RelativeOrAbsoluteLink)(
  css({
    appearance: 'none',
    bg: 'transparent',
    border: 'none',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    color: 'primary',
    cursor: 'pointer',
    display: 'inline-block',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    p: 0,
    textDecoration: 'none',
    '&:hover': {
      borderBottomColor: 'currentColor',
    },
  })
)

export default Link
