import { combineReducers } from 'redux'
import {
  createCollectionSlice,
  createRequestSlice,
  createResourceSlice,
} from '../utils'

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

export const selectors = {
  items: Object.entries(itemSelectors).reduce((acc, [name, selector]) => {
    acc[name] = (state, ...options) => selector(state.items, ...options)
    return acc
  }, {}),
  itemCollections: Object.entries(itemCollectionSelectors).reduce(
    (acc, [name, selector]) => {
      acc[name] = (state, ...options) =>
        selector(state.itemCollections, ...options)
      return acc
    },
    {}
  ),
  requests: Object.entries(requestSelectors).reduce((acc, [name, selector]) => {
    acc[name] = (state, ...options) => selector(state.requests, ...options)
    return acc
  }, {}),
}

export default combineReducers({
  items: itemReducer,
  itemCollections: itemCollectionReducer,
  requests: requestReducer,
})
