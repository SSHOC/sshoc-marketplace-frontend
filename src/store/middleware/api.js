import { API_REQUEST, FETCH_POLICY, REQUEST_STATUS } from '../constants'
import { selectors } from '../reducers'
import { createCacheKey, createUrl, HttpError } from '../utils'

// TODO: separate concerns into multiple middleware (request caching, response normalization)
// TODO: maybe use normalizr w/ schema

const createApiMiddleware = fetch => ({
  dispatch,
  getState,
}) => next => async action => {
  next(action)

  if (action.type !== API_REQUEST) return

  const {
    // collections,
    fetchPolicy = FETCH_POLICY.CACHE_AND_NETWORK,
    next: {
      IDLE: onAbort,
      FAILED: onError,
      PENDING: onStart,
      SUCCEEDED: onSuccess,
    },
    normalize,
    request,
    // resources,
  } = action.meta

  const cacheKey = createCacheKey(request)

  const inFlighRequest = selectors.requests.selectRequestByKey(
    getState(),
    cacheKey
  )
  if (inFlighRequest.status === REQUEST_STATUS.PENDING) {
    // request already in-flight
    return dispatch({ type: API_REQUEST.DEDUPED })
  }
  if (inFlighRequest.status === REQUEST_STATUS.SUCCEEDED) {
    // request already cached
    if (fetchPolicy === FETCH_POLICY.CACHE_FIRST) {
      // cache-first: use cached request, don't revalidate
      return dispatch({ type: API_REQUEST.CACHED })
    }
    if (fetchPolicy === FETCH_POLICY.CACHE_AND_NETWORK) {
      dispatch({ type: API_REQUEST.REVALIDATING })
    }
  }

  const timestamp = Date.now()
  const { abort, signal } = new AbortController()

  dispatch({
    type: onStart,
    payload: { abort },
    meta: { cacheKey, timestamp },
  })
  dispatch({
    type: API_REQUEST.PENDING,
    payload: { abort },
    meta: { cacheKey, timestamp },
  })

  try {
    const {
      baseUrl,
      format = 'json',
      headers,
      method,
      path,
      query,
    } = action.payload

    const url = createUrl({ baseUrl, path, query })
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        ...headers,
      },
      method,
      signal,
    })

    if (!response.ok) {
      throw new HttpError(response)
    }

    const data = await response[format]()

    const timestamp = Date.now()
    const { entities, info, resources } = normalize(data)

    dispatch({
      type: onSuccess,
      payload: { entities, resources },
      meta: { cacheKey, info, response, timestamp },
    })
    dispatch({
      type: API_REQUEST.SUCCEEDED,
      payload: { entities, resources },
      meta: { cacheKey, info, response, timestamp },
    })
  } catch (error) {
    const timestamp = Date.now()

    if (error.name === 'AbortError') {
      dispatch({ type: onAbort, meta: { cacheKey, timestamp } })
      dispatch({ type: API_REQUEST.IDLE, meta: { cacheKey, timestamp } })
    } else {
      dispatch({
        type: onError,
        error: true,
        payload: error,
        meta: { cacheKey, timestamp },
      })
      dispatch({
        type: API_REQUEST.FAILED,
        error: true,
        payload: error,
        meta: { cacheKey, timestamp },
      })
    }
  }
}

export default createApiMiddleware