import React from 'react'
import 'styled-components/macro'
import AboutScreen from '../../components/AboutScreen/AboutScreen'
import Screen from '../../components/Screen/Screen'
import Main from '../../elements/Main/Main'
import BackgroundImage from '../../images/bg_about.jpg'
import BackgroundImageHiDPI from '../../images/bg_about@2x.jpg'
import { useNavigationFocusScroll, useSearchParams } from '../../utils'

const AboutPage = () => {
  const focusRef = useNavigationFocusScroll()
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
        onSearchParamsChange={setSearchParams}
      >
        <AboutScreen />
      </Screen>
    </Main>
  )
}

export default AboutPage
