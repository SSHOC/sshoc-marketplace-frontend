import React from 'react'
import 'styled-components/macro'
import Container from '../../elements/Container/Container'
import Heading from '../../elements/Heading/Heading'
import Main from '../../elements/Main/Main'
import { useNavigationFocusScroll } from '../../utils'

const NotFoundPage = () => {
  const focusRef = useNavigationFocusScroll()

  return (
    <Main ref={focusRef}>
      <Container>
        <Heading>Not Found</Heading>
      </Container>
    </Main>
  )
}

export default NotFoundPage
