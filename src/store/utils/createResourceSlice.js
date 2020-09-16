import { FETCH_RESOURCE } from '../constants'

export const createResourceSlice = resourceName => {
  const initialState = {}

  const reducer = (state = { ...initialState }, action) => {
    const { resources } = action.payload || {}
    if (!resources || !resources[resourceName]) {
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
          ...resources[resourceName],
        }
      }

      default:
        return state
    }
  }

  const selectors = {
    selectResourceById(state, id) {
      return state[id] || null
    },
    selectResources(state, ids) {
      if (!Array.isArray(ids)) return null
      return ids.map(id => state[id]).filter(Boolean)
    },
    selectAllResources(state) {
      return state
    },
  }

  return {
    reducer,
    selectors,
  }
}
