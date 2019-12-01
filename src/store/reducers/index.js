import { combineReducers } from 'redux'
import { createRequestSlice, createResourceSlice } from '../utils'

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
  requests: Object.entries(requestSelectors).reduce((acc, [name, selector]) => {
    acc[name] = (state, ...options) => selector(state.requests, ...options)
    return acc
  }, {}),
}

export default combineReducers({
  items: itemReducer,
  requests: requestReducer,
})
