import css from '@styled-system/css'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import 'styled-components/macro'
import ItemDetails from '../../components/ItemDetails/ItemDetails'
import ItemSidebar from '../../components/ItemSidebar/ItemSidebar'
import SearchBar from '../../components/SearchBar/SearchBar'
import Box from '../../elements/Box/Box'
import Breadcrumbs from '../../elements/Breadcrumbs/Breadcrumbs'
import Container from '../../elements/Container/Container'
import Flex from '../../elements/Flex/Flex'
import Main from '../../elements/Main/Main'
import BackgroundImage from '../../images/bg_details.png'
import BackgroundImageHiDPI from '../../images/bg_details@2x.png'
import { fetchTrainingMaterial } from '../../store/actions/items'
import { selectors } from '../../store/reducers'
import { useNavigationFocus } from '../../utils'

const TrainingMaterialPage = () => {
  const dispatch = useDispatch()
  const focusRef = useNavigationFocus()
  const { id } = useParams()

  useEffect(() => {
    dispatch(fetchTrainingMaterial({ id }))
  }, [dispatch, id])

  const resource = useSelector(state =>
    selectors.items.selectResourceById(state, id)
  )
  const request = useSelector(state =>
    selectors.requests.selectRequestByName(state, {
      name: fetchTrainingMaterial,
      query: { id },
    })
  )

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
            {
              label: 'Training Materials',
              value: '/search?categories=training-material',
            },
            { label: `Details` },
          ]}
        />
        <Flex css={css({ mt: 6 })}>
          <Box css={{ flex: 3 }}>
            <ItemDetails request={request} resource={resource} />
          </Box>
          <aside css={css({ flex: 1, minWidth: 'sidebar', pl: 4 })}>
            <ItemSidebar resource={resource} />
          </aside>
        </Flex>
      </Container>
    </Main>
  )
}

export default TrainingMaterialPage
