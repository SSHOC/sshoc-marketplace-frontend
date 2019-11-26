import css from '@styled-system/css'
import styled from 'styled-components/macro'
import Box from '../Box/Box'

const Text = styled(Box)(
  css({
    color: 'text',
    variant: 'text.body',
  })
)

export default Text
