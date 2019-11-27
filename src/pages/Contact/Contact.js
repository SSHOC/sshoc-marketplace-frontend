import React from 'react'
import Container from '../../elements/Container/Container'
import Main from '../../elements/Main/Main'
import { useNavigationFocus } from '../../utils'

const ContactPage = () => {
  const focusRef = useNavigationFocus()

  return (
    <Main ref={focusRef}>
      <Container>
        <h1>Contact</h1>
      </Container>
    </Main>
  )
}

export default ContactPage
