import css from '@styled-system/css'
import styled from 'styled-components/macro'
import Box from '../Box/Box'

const Main = styled(Box).attrs({ as: 'main', tabIndex: -1 })(
  css({
    mx: 'auto',
    maxWidth: 'wide',
    outline: 'none',
    width: '100%',
  })
)

export default Main
