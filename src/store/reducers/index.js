import { combineReducers } from 'redux'
import {
  createCollectionSlice,
  createRequestSlice,
  createResourceSlice,
} from '../utils'
import userReducer, * as userSelectors from './user'

const {
  reducer: itemCollectionReducer,
  selectors: itemCollectionSelectors,
} = createCollectionSlice('items')

const { reducer: itemReducer, selectors: itemSelectors } = createResourceSlice(
  'items'
)

const {
  reducer: requestReducer,
  selectors: requestSelectors,
} = createRequestSlice()

const mapSelectors = (selectors, slice) =>
  Object.entries(selectors).reduce((acc, [name, selector]) => {
    acc[name] = (state, ...options) => selector(state[slice], ...options)
    return acc
  }, {})

export const selectors = {
  items: mapSelectors(itemSelectors, 'items'),
  itemCollections: mapSelectors(itemCollectionSelectors, 'itemCollections'),
  requests: mapSelectors(requestSelectors, 'requests'),
  user: mapSelectors(userSelectors, 'user'),
}

export default combineReducers({
  items: itemReducer,
  itemCollections: itemCollectionReducer,
  requests: requestReducer,
  user: userReducer,
})
