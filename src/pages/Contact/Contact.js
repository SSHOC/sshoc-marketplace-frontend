import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import SearchBar from '../../components/SearchBar/SearchBar'
import Breadcrumbs from '../../elements/Breadcrumbs/Breadcrumbs'
import Container from '../../elements/Container/Container'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Main from '../../elements/Main/Main'
import { useNavigationFocus } from '../../utils'

const ContactPage = () => {
  const focusRef = useNavigationFocus()

  return (
    <Main ref={focusRef}>
      <Container as={Flex} css={{ flexDirection: 'column' }}>
        <SearchBar css={{ alignSelf: 'flex-end', width: '50%' }} />
        <Breadcrumbs
          paths={[{ label: 'Home', value: '/' }, { label: `Contact` }]}
        />
        <Heading variant="h1" css={css({ mt: 4 })}>
          Contact
        </Heading>
      </Container>
    </Main>
  )
}

export default ContactPage
