import css from '@styled-system/css'
import styled from 'styled-components/macro'
import Box from '../Box/Box'

const Badge = styled(Box)(
  css({
    borderColor: 'grey.400',
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'grey.800',
    display: 'inline-flex',
    fontSize: 0,
    px: 2,
    py: 1,
    userSelect: 'none',
    textAlign: 'center',
    whiteSpace: 'pre',
  })
)

export default Badge
