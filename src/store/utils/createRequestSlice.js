import { API_REQUEST, REQUEST_STATUS } from '../constants'
import { createCacheKey } from '../utils'

export const createRequestSlice = () => {
  const initialState = {}

  const defaultState = {
    abort: null,
    error: null,
    info: {},
    response: {},
    resources: {},
    status: REQUEST_STATUS.IDLE,
  }

  const reducer = (state = { ...initialState }, action) => {
    switch (action.type) {
      case API_REQUEST.PENDING: {
        const { abort } = action.payload
        const { cacheKey, timestamp } = action.meta
        return {
          ...state,
          [cacheKey]: {
            ...defaultState,
            ...state[cacheKey],
            abort,
            error: null,
            lastRequested: timestamp,
            status: REQUEST_STATUS.PENDING,
          },
        }
      }

      case API_REQUEST.SUCCEEDED: {
        const { entities } = action.payload
        const { cacheKey, info, response, timestamp } = action.meta
        return {
          ...state,
          [cacheKey]: {
            ...state[cacheKey],
            abort: null,
            error: null,
            info,
            lastSucceeded: timestamp,
            resources: Object.entries(entities).reduce(
              (acc, [resourceName, entities]) => {
                acc[resourceName] = entities
                return acc
              },
              {}
            ),
            response: {
              headers: response.headers,
            },
            status: REQUEST_STATUS.SUCCEEDED,
          },
        }
      }

      case API_REQUEST.FAILED: {
        const { cacheKey, timestamp } = action.meta
        return {
          ...state,
          [cacheKey]: {
            ...state[cacheKey],
            abort: null,
            error: action.payload,
            lastFailed: timestamp,
            status: REQUEST_STATUS.FAILED,
          },
        }
      }

      case API_REQUEST.IDLE: {
        const { cacheKey, timestamp } = action.meta
        return {
          ...state,
          [cacheKey]: {
            ...state[cacheKey],
            abort: null,
            error: null,
            lastAborted: timestamp,
            status: REQUEST_STATUS.IDLE,
          },
        }
      }

      default:
        return state
    }
  }

  const selectors = {
    selectRequestByName(state, { name, query = {} }) {
      const cacheKey = createCacheKey({ name, query })
      return state[cacheKey] || defaultState
    },
    selectRequestByKey(state, cacheKey) {
      return state[cacheKey] || defaultState
    },
  }

  return {
    reducer,
    selectors,
  }
}
