import React from 'react'
import Container from '../../elements/Container/Container'
import Heading from '../../elements/Heading/Heading'
import Main from '../../elements/Main/Main'
import { useNavigationFocus } from '../../utils'

const AboutPage = () => {
  const focusRef = useNavigationFocus()

  return (
    <Main ref={focusRef}>
      <Container>
        <Heading>About</Heading>
      </Container>
    </Main>
  )
}

export default AboutPage
