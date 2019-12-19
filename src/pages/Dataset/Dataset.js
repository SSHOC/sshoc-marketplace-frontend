import React from 'react'
import { useParams } from 'react-router-dom'
import 'styled-components/macro'
import ItemScreen from '../../components/ItemScreen/ItemScreen'
import Screen from '../../components/Screen/Screen'
import Main from '../../elements/Main/Main'
import BackgroundImage from '../../images/bg_details.jpg'
import BackgroundImageHiDPI from '../../images/bg_details@2x.jpg'
import { fetchDataset } from '../../store/actions/items'
import { useNavigationFocus, useSearchParams } from '../../utils'

const DatasetPage = () => {
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
          {
            label: 'Datasets',
            value: '/search?categories=dataset&sort=label',
          },
          { label: `Details` },
        ]}
        onSearchParamsChange={setSearchParams}
      >
        <ItemScreen fetchItem={fetchDataset} id={id} />
      </Screen>
    </Main>
  )
}

export default DatasetPage
