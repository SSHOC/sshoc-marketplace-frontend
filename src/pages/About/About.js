import React from 'react'
import Container from '../../elements/Container/Container'
import Main from '../../elements/Main/Main'
import { useNavigationFocus } from '../../utils'

const AboutPage = () => {
  const focusRef = useNavigationFocus()

  return (
    <Main ref={focusRef}>
      <Container>
        <h1>About</h1>
      </Container>
    </Main>
  )
}

export default AboutPage
