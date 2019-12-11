import css from '@styled-system/css'
import styled from 'styled-components/macro'
import Box from '../Box/Box'

const Grid = styled(Box)(props =>
  css({
    display: 'grid',
    gridGap: props.gap,
    listStyle: 'none',
    m: 0,
    p: 0,
  })
)

export default Grid
