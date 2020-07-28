import css from '@styled-system/css'
import React, { Fragment } from 'react'
import 'styled-components/macro'
import Browse from '../../components/Browse/Browse'
import SearchForm from '../../components/SearchForm/SearchForm'
import Container from '../../elements/Container/Container'
import Heading from '../../elements/Heading/Heading'
import Link from '../../elements/Link/Link'
import Text from '../../elements/Text/Text'

const HomeScreen = () => (
  <Fragment>
    <Container css={css({ my: 6 })} variant="narrow">
      <Heading as="h1" css={css({ fontSize: 26, mb: 4 })} variant="h2">
        Social Sciences &amp; Humanities Open Marketplace
      </Heading>
      <Text css={css({ lineHeight: 'large' })}>
        Discover new resources for your research in Social Sciences and
        Humanities: tools, services, training materials and datasets,
        contextualised. <Link to="/about">Read more&hellip;</Link>
      </Text>
      <Text css={css({ fontWeight: 'bold', lineHeight: 'large', my: 3 })}>
        SSH Open Marketplace is under development and the current content is
        subject to change.
        <br />
        Beta release is{' '}
        <Link to="/about#in-development">planned for December 2020</Link>.
      </Text>
      <SearchForm />
    </Container>
    <Container css={css({ mt: 480 })}>
      <Browse />
    </Container>
  </Fragment>
)

export default HomeScreen
