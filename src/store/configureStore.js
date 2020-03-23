import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import configureMiddleware from './middleware'
import rootReducer from './reducers'

export const configureStore = ({ fetch = window.fetch, initialState }) =>
  createStore(
    rootReducer,
    initialState,
    composeWithDevTools({ serialize: { error: true } })(
      applyMiddleware(...configureMiddleware({ fetch }))
    )
  )
