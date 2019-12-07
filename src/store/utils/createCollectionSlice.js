import { FETCH_RESOURCE } from '../constants'
import { createCacheKey } from './createCacheKey'

export const createCollectionSlice = resourceName => {
  const initialState = {}

  const defaultState = {}

  const reducer = (state = { ...initialState }, action) => {
    const { entities } = action.payload || {}
    const { collections, info } = action.meta || {}
    if (!collections || !entities || !entities[resourceName]) {
      return state
    }

    switch (action.type) {
      case FETCH_RESOURCE.IDLE:
      case FETCH_RESOURCE.FAILED:
      case FETCH_RESOURCE.PENDING:
        return state

      case FETCH_RESOURCE.SUCCEEDED: {
        return {
          ...state,
          ...collections.reduce((acc, { name, query, replace = false }) => {
            const collectionKey = createCacheKey({ name, query })
            acc[collectionKey] = {
              resources: replace
                ? entities[resourceName]
                : [
                    ...((state[collectionKey] || {}).resources || []),
                    ...entities[resourceName],
                  ],
              info,
            }
            return acc
          }, {}),
        }
      }

      default:
        return state
    }
  }

  const selectors = {
    selectCollectionByName(state, { name, query = {} }) {
      const collectionKey = createCacheKey({ name, query })
      return state[collectionKey] || defaultState
    },
    selectCollectionByKey(state, collectionKey) {
      return state[collectionKey] || defaultState
    },
  }

  return {
    reducer,
    selectors,
  }
}
