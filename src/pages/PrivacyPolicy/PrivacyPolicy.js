import React from 'react'
import Container from '../../elements/Container/Container'
import Heading from '../../elements/Heading/Heading'
import Main from '../../elements/Main/Main'
import { useNavigationFocus } from '../../utils'

const PrivacyPolicyPage = () => {
  const focusRef = useNavigationFocus()

  return (
    <Main ref={focusRef}>
      <Container>
        <Heading>PrivacyPolicy</Heading>
      </Container>
    </Main>
  )
}

export default PrivacyPolicyPage
