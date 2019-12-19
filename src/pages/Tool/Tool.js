import React from 'react'
import { useParams } from 'react-router-dom'
import 'styled-components/macro'
import ItemScreen from '../../components/ItemScreen/ItemScreen'
import Screen from '../../components/Screen/Screen'
import Main from '../../elements/Main/Main'
import BackgroundImage from '../../images/bg_details.jpg'
import BackgroundImageHiDPI from '../../images/bg_details@2x.jpg'
import { fetchTool } from '../../store/actions/items'
import { useNavigationFocus, useSearchParams } from '../../utils'

const ToolPage = () => {
  const focusRef = useNavigationFocus()
  const { id } = useParams()
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
        breadcrumbs={[
          { label: 'Home', value: '/' },
          { label: 'Tools', value: '/search?categories=tool&sort=label' },
          { label: `Details` },
        ]}
        onSearchParamsChange={setSearchParams}
      >
        <ItemScreen fetchItem={fetchTool} id={id} />
      </Screen>
    </Main>
  )
}

export default ToolPage
