import React from 'react'
import Container from '../../elements/Container/Container'
import Main from '../../elements/Main/Main'
import { useNavigationFocus } from '../../utils'

const PrivacyPolicyPage = () => {
  const focusRef = useNavigationFocus()

  return (
    <Main ref={focusRef}>
      <Container>
        <h1>PrivacyPolicy</h1>
      </Container>
    </Main>
  )
}

export default PrivacyPolicyPage
