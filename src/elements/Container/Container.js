import css from '@styled-system/css'
import styled from 'styled-components/macro'
import Box from '../Box/Box'

const Container = styled(Box)(
  css({
    maxWidth: 'container',
    mx: 'auto',
    p: 3,
  })
)

export default Container
