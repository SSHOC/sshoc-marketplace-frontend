import styled from 'styled-components/macro'
import Box from '../Box/Box'

const Main = styled(Box).attrs({ as: 'main', tabIndex: -1 })({
  outline: 'none',
})

export default Main
