import styled from 'styled-components/macro'

const Invisible = styled('div')({
  height: 1,
  margin: -1,
  opacity: 0,
  overflow: 'hidden',
  position: 'absolute',
  width: 1,
})

export default Invisible
