import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import SearchForm from '../../components/SearchForm/SearchForm'
import Container from '../../elements/Container/Container'
import Heading from '../../elements/Heading/Heading'
import Link from '../../elements/Link/Link'
import Main from '../../elements/Main/Main'
import Text from '../../elements/Text/Text'
import BackgroundImage from '../../images/bg_home.jpg'
import BackgroundImageHiDPI from '../../images/bg_home@2x.jpg'
import { useNavigationFocus } from '../../utils'

const HomePage = () => {
  const focusRef = useNavigationFocus()

  return (
    <Main
      css={{
        backgroundImage: `url(${
          window.devicePixelRatio >= 1 ? BackgroundImageHiDPI : BackgroundImage
        })`,
        backgroundSize: 'contain',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
      ref={focusRef}
    >
      <Container>
        <Container css={css({ my: 6 })} variant="narrow">
          <Heading
            as="h1"
            css={css({ fontWeight: 'regular', mb: 3 })}
            variant="h2"
          >
            <span css={css({ fontSize: 8 })}>SSHOC</span> Marketplace
          </Heading>
          <Text css={css({ lineHeight: 'large' })}>
            Several sentences: What user can find on this website? For whom it
            was created? Who has made this website? Place for some key sentences
            which will help users to understand what is this website for.{' '}
            <Link to="/about">Read more&hellip;</Link>
          </Text>
          <SearchForm />
        </Container>
      </Container>
    </Main>
  )
}

export default HomePage
