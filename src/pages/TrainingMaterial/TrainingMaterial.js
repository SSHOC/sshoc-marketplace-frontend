import React from 'react'
import { useParams } from 'react-router-dom'
import 'styled-components/macro'
import ItemScreen from '../../components/ItemScreen/ItemScreen'
import Screen from '../../components/Screen/Screen'
import Main from '../../elements/Main/Main'
import BackgroundImage from '../../images/bg_details.png'
import BackgroundImageHiDPI from '../../images/bg_details@2x.png'
import { fetchTrainingMaterial } from '../../store/actions/items'
import { useNavigationFocus, useSearchParams } from '../../utils'

const TrainingMaterialPage = () => {
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
            label: 'Training Materials',
            value: '/search?categories=training-material&sort=label',
          },
          { label: `Details` },
        ]}
        setSearchParams={setSearchParams}
      >
        <ItemScreen fetchItem={fetchTrainingMaterial} id={id} />
      </Screen>
    </Main>
  )
}

export default TrainingMaterialPage
