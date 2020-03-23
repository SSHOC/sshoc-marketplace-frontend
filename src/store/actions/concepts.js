import API, { getErrorMessage } from '../../api'
import { API_REQUEST, FETCH_RESOURCE } from '../constants'
import { createNormalizer } from '../utils'

export const fetchConcepts = ({ page, query, types }) => ({
  type: API_REQUEST,
  payload: {
    ...API.searchConcepts({ page, query, types }),
  },
  meta: {
    collections: [
      {
        name: fetchConcepts.name,
        query: { query, types },
      },
    ],
    getErrorMessage,
    next: FETCH_RESOURCE,
    normalize: createNormalizer({
      field: 'concepts',
      idKey: 'code',
      resourceType: 'concepts',
    }),
    request: {
      name: fetchConcepts.name,
      query: { page, query, types },
    },
  },
})
fetchConcepts.toString = () => fetchConcepts.name
