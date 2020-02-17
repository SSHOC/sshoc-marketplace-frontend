import css from '@styled-system/css'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import 'styled-components/macro'
import ItemDetails from '../../components/ItemDetails/ItemDetails'
import ItemSidebar from '../../components/ItemSidebar/ItemSidebar'
import Box from '../../elements/Box/Box'
import Flex from '../../elements/Flex/Flex'
import { selectors } from '../../store/reducers'
import { createPath } from '../../utils'
import ItemEditScreen from '../ItemEditScreen/ItemEditScreen'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

const ItemScreenContainer = ({ fetchItem, id }) => {
  const dispatch = useDispatch()
  const { path /*, url */ } = useRouteMatch()

  useEffect(() => {
    dispatch(fetchItem({ id }))
  }, [dispatch, fetchItem, id])

  const resource = useSelector(state =>
    selectors.items.selectResourceById(state, id)
  )
  const request = useSelector(state =>
    selectors.requests.selectRequestByName(state, {
      name: fetchItem,
      query: { id },
    })
  )

  return (
    <Switch>
      <ProtectedRoute path={createPath(path, 'edit')}>
        <ItemEditScreen request={request} resource={resource} />
      </ProtectedRoute>
      <Route>
        <ItemScreen request={request} resource={resource} />
      </Route>
    </Switch>
  )
}

export const ItemScreen = ({ request, resource }) => (
  <Flex css={css({ my: 6 })}>
    <Box css={{ flex: 3 }}>
      <ItemDetails request={request} resource={resource} />
    </Box>
    <aside
      css={css({ flexBasis: 'sidebar', flexGrow: 0, flexShrink: 1, pl: 4 })}
    >
      <ItemSidebar resource={resource} />
    </aside>
  </Flex>
)

export default ItemScreenContainer
