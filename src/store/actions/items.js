import API, { getErrorMessage } from '../../api'
import { API_REQUEST, FETCH_RESOURCE } from '../constants'
import { createNormalizer } from '../utils'

export const fetchDataset = ({ id }) => ({
  type: API_REQUEST,
  payload: {
    ...API.getDatasetById({ id }),
  },
  meta: {
    getErrorMessage,
    next: FETCH_RESOURCE,
    normalize: createNormalizer({}),
    request: {
      name: 'fetchDataset',
      query: { id },
    },
  },
})
fetchDataset.toString = () => 'fetchDataset'

export const fetchTool = ({ id }) => ({
  type: API_REQUEST,
  payload: {
    ...API.getToolById({ id }),
  },
  meta: {
    getErrorMessage,
    next: FETCH_RESOURCE,
    normalize: createNormalizer({}),
    request: {
      name: 'fetchTool',
      query: { id },
    },
  },
})
fetchTool.toString = () => 'fetchTool'

export const fetchTrainingMaterial = ({ id }) => ({
  type: API_REQUEST,
  payload: {
    ...API.getTrainingMaterialById({ id }),
  },
  meta: {
    getErrorMessage,
    next: FETCH_RESOURCE,
    normalize: createNormalizer({}),
    request: {
      name: 'fetchTrainingMaterial',
      query: { id },
    },
  },
})
fetchTrainingMaterial.toString = () => 'fetchTrainingMaterial'

export const fetchSearchResults = ({
  categories,
  facets,
  page,
  query,
  sort,
}) => ({
  type: API_REQUEST,
  payload: {
    ...API.search({ categories, facets, page, query, sort }),
  },
  meta: {
    collections: [
      {
        name: 'fetchSearchResults',
        query: { categories, query, sort },
      },
    ],
    getErrorMessage,
    next: FETCH_RESOURCE,
    normalize: createNormalizer({ field: 'items' }),
    request: {
      name: 'fetchSearchResults',
      query: { categories, facets, page, query, sort },
    },
  },
})
fetchSearchResults.toString = () => 'fetchSearchResults'
