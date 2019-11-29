import css from '@styled-system/css'
import styled from 'styled-components/macro'
import Flex from '../Flex/Flex'

const Stack = styled(Flex)(
  css({
    flexDirection: 'column',
    listStyle: 'none',
    m: 0,
    p: 0,
  })
)

export default Stack
