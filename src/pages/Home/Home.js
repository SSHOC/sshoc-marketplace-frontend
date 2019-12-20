import React from 'react'
import 'styled-components/macro'
import HomeScreen from '../../components/HomeScreen/HomeScreen'
import Container from '../../elements/Container/Container'
import Main from '../../elements/Main/Main'
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
        <HomeScreen />
      </Container>
    </Main>
  )
}

export default HomePage
