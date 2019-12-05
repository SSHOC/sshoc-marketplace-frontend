export const API_REQUEST = {
  CACHED: 'API_REQUEST_CACHED',
  DEDUPED: 'API_REQUEST_DEDUPED',
  FAILED: 'API_REQUEST_FAILED',
  IDLE: 'API_REQUEST_IDLE',
  PENDING: 'API_REQUEST_PENDING',
  REVALIDATING: 'API_REQUEST_REVALIDATING',
  SUCCEEDED: 'API_REQUEST_SUCCEEDED',
}
API_REQUEST.toJSON = () => 'API_REQUEST'
API_REQUEST.toString = () => 'API_REQUEST'

export const FETCH_RESOURCE = {
  FAILED: 'FETCH_RESOURCE_FAILED',
  IDLE: 'FETCH_RESOURCE_IDLE',
  PENDING: 'FETCH_RESOURCE_PENDING',
  SUCCEEDED: 'FETCH_RESOURCE_SUCCEEDED',
}
FETCH_RESOURCE.toJSON = () => 'FETCH_RESOURCE'
FETCH_RESOURCE.toString = () => 'FETCH_RESOURCE'

export const REQUEST_STATUS = {
  FAILED: 'FAILED',
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  SUCCEEDED: 'SUCCEEDED',
}

export const FETCH_POLICY = {
  CACHE_AND_NETWORK: 'CACHE_AND_NETWORK', // stale-while-revalidate
  CACHE_FIRST: 'CACHE_FIRST',
  // CACHE_ONLY: 'CACHE_ONLY',
  // NETWORK_ONLY: 'NETWORK_ONLY',
  // NO_CACHE: 'NO_CACHE',
}