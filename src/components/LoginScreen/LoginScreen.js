import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Container from '../../elements/Container/Container'
import Heading from '../../elements/Heading/Heading'
import LoginForm from '../LoginForm/LoginForm'

const HomeScreen = () => (
  <Container css={css({ my: 6 })} variant="narrow">
    <Heading as="h1" css={css({ fontSize: 26, mb: 4 })} variant="h2">
      Social Sciences &amp; Humanities Open Marketplace
    </Heading>
    <LoginForm />
  </Container>
)

export default HomeScreen
