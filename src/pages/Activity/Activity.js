import React from 'react'
import { useParams } from 'react-router-dom'
import 'styled-components/macro'
import ItemScreen from '../../components/ItemScreen/ItemScreen'
import Screen from '../../components/Screen/Screen'
import Main from '../../elements/Main/Main'
import BackgroundImage from '../../images/bg_details.png'
import BackgroundImageHiDPI from '../../images/bg_details@2x.png'
import { fetchActivity } from '../../store/actions/items'
import { useNavigationFocusScroll, useSearchParams } from '../../utils'

const ActivityPage = () => {
  const focusRef = useNavigationFocusScroll()
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
          {
            label: 'Activities',
            value: '/search?categories=activity&sort=label',
          },
          { label: `Details` },
        ]}
        onSearchParamsChange={setSearchParams}
      >
        <ItemScreen fetchItem={fetchActivity} id={id} />
      </Screen>
    </Main>
  )
}

export default ActivityPage
