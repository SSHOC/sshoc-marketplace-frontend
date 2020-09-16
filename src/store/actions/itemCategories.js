import API, { getErrorMessage } from '../../api'
import { API_REQUEST, FETCH_RESOURCE } from '../constants'

export const fetchItemCategories = () => ({
  type: API_REQUEST,
  payload: {
    ...API.getItemCategories(),
  },
  meta: {
    getErrorMessage,
    next: FETCH_RESOURCE,
    normalize: data => ({
      entities: { itemCategories: Object.keys(data) },
      resources: { itemCategories: data },
    }),
    request: {
      name: 'fetchItemCategories',
    },
  },
})
fetchItemCategories.toString = () => 'fetchItemCategories'
