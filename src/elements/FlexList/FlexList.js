import styled from 'styled-components/macro'
import Flex from '../Flex/Flex'

const FlexList = styled(Flex)({
  listStyle: 'none',
  margin: 0,
  padding: 0,
})

FlexList.defaultProps = {
  as: 'ul',
}

export default FlexList
