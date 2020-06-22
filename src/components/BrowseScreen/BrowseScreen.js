import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Container from '../../elements/Container/Container'
import Heading from '../../elements/Heading/Heading'
import Text from '../../elements/Text/Text'

const BrowseScreen = () => (
  <Container css={css({ my: 6, width: '100%', px: 0 })}>
    <Heading as="h1" css={css({ fontSize: 26, mb: 4 })} variant="h2">
      Browse
    </Heading>
    <Text>Sorry, this screen is still work in progress.</Text>
  </Container>
)

export default BrowseScreen
