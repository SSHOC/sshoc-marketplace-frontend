import React from 'react'
import 'styled-components/macro'
import Screen from '../../components/Screen/Screen'
import SearchScreen from '../../components/SearchScreen/SearchScreen'
import Main from '../../elements/Main/Main'
import BackgroundImage from '../../images/bg_search.png'
import BackgroundImageHiDPI from '../../images/bg_search@2x.png'
import { useNavigationFocus, useSearchParams } from '../../utils'

const SearchPage = () => {
  const focusRef = useNavigationFocus()
  const [searchParams, setSearchParams] = useSearchParams()

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
        breadcrumbs={[
          { label: 'Home', value: '/' },
          { label: 'Search results' },
        ]}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      >
        <SearchScreen
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      </Screen>
    </Main>
  )
}

export default SearchPage
