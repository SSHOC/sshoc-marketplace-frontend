import React from 'react'
import Container from '../../elements/Container/Container'
import Heading from '../../elements/Heading/Heading'
import Main from '../../elements/Main/Main'
import { useNavigationFocus } from '../../utils'

const ContactPage = () => {
  const focusRef = useNavigationFocus()

  return (
    <Main ref={focusRef}>
      <Container>
        <Heading>Contact</Heading>
      </Container>
    </Main>
  )
}

export default ContactPage
