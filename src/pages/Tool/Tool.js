import css from '@styled-system/css'
import React from 'react'
import { useParams } from 'react-router-dom'
import 'styled-components/macro'
import SearchBar from '../../components/SearchBar/SearchBar'
import Breadcrumbs from '../../elements/Breadcrumbs/Breadcrumbs'
import Container from '../../elements/Container/Container'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Main from '../../elements/Main/Main'
import BackgroundImage from '../../images/bg_details.png'
import BackgroundImageHiDPI from '../../images/bg_details@2x.png'
import { useNavigationFocus } from '../../utils'

const ToolPage = () => {
  const focusRef = useNavigationFocus()

  const { id } = useParams()

  return (
    <Main
      css={{
        // TODO: Proper media query, or use <img srcset /> or <picture />
        backgroundImage: `url(${
          window.devicePixelRatio >= 1 ? BackgroundImageHiDPI : BackgroundImage
        })`,
        backgroundSize: 'contain',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
      ref={focusRef}
    >
      <Container as={Flex} css={{ flexDirection: 'column' }}>
        <SearchBar css={{ alignSelf: 'flex-end', width: '50%' }} />
        <Breadcrumbs
          paths={[
            { label: 'Home', value: '/' },
            { label: 'Tools', value: '/search?categories=tools' },
            { label: `Details` },
          ]}
        />
        <Heading variant="h1" css={css({ mt: 3 })}>
          Tool {id}
        </Heading>
      </Container>
    </Main>
  )
}

export default ToolPage
