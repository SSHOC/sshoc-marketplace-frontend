import styled from 'styled-components/macro'
import Box from '../Box/Box'

const Grid = styled(Box)(props => ({
  display: 'grid',
  gridGap: props.gap,
}))

export default Grid
