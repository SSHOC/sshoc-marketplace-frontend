import React from 'react'
import 'styled-components/macro'
import AboutScreen from '../../components/AboutScreen/AboutScreen'
import Screen from '../../components/Screen/Screen'
import Main from '../../elements/Main/Main'
import BackgroundImage from '../../images/bg_about.png'
import BackgroundImageHiDPI from '../../images/bg_about@2x.png'
import { useNavigationFocus, useSearchParams } from '../../utils'

const AboutPage = () => {
  const focusRef = useNavigationFocus()
  const [, setSearchParams] = useSearchParams()

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
      <Screen
        breadcrumbs={[{ label: 'Home', value: '/' }, { label: `About` }]}
        setSearchParams={setSearchParams}
      >
        <AboutScreen />
      </Screen>
    </Main>
  )
}

export default AboutPage
