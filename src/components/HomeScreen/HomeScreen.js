import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import SearchForm from '../../components/SearchForm/SearchForm'
import Container from '../../elements/Container/Container'
import Heading from '../../elements/Heading/Heading'
import Link from '../../elements/Link/Link'
import Text from '../../elements/Text/Text'

const HomeScreen = () => (
  <Container css={css({ my: 6 })} variant="narrow">
    <Heading as="h1" css={css({ fontWeight: 'regular', mb: 3 })} variant="h2">
      <span css={css({ fontSize: 8 })}>SSHOC</span> Marketplace
    </Heading>
    <Text css={css({ lineHeight: 'large' })}>
      Several sentences: What user can find on this website? For whom it was
      created? Who has made this website? Place for some key sentences which
      will help users to understand what is this website for.{' '}
      <Link to="/about">Read more&hellip;</Link>
    </Text>
    <SearchForm />
  </Container>
)

export default HomeScreen
