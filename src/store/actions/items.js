import API from '../../api'
import { API_REQUEST, FETCH_RESOURCE } from '../constants'
import { createNormalizer } from '../utils'

export const fetchDataset = ({ id }) => ({
  type: API_REQUEST,
  payload: {
    ...API.getDatasetById({ id }),
  },
  meta: {
    next: FETCH_RESOURCE,
    normalize: createNormalizer(),
    request: {
      name: 'fetchDataset',
      query: { id },
    },
  },
})
fetchDataset.toString = () => 'fetchDataset'

export const fetchSolution = ({ id }) => ({
  type: API_REQUEST,
  payload: {
    ...API.getSolutionById({ id }),
  },
  meta: {
    next: FETCH_RESOURCE,
    normalize: createNormalizer(),
    request: {
      name: 'fetchSolution',
      query: { id },
    },
  },
})
fetchSolution.toString = () => 'fetchSolution'

export const fetchTool = ({ id }) => ({
  type: API_REQUEST,
  payload: {
    ...API.getToolById({ id }),
  },
  meta: {
    next: FETCH_RESOURCE,
    normalize: createNormalizer(),
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
    next: FETCH_RESOURCE,
    normalize: createNormalizer(),
    request: {
      name: 'fetchTrainingMaterial',
      query: { id },
    },
  },
})
fetchTrainingMaterial.toString = () => 'fetchTrainingMaterial'

export const fetchSearchResults = ({ categories, page, query, sort }) => ({
  type: API_REQUEST,
  payload: {
    ...API.search({ categories, page, query, sort }),
  },
  meta: {
    next: FETCH_RESOURCE,
    normalize: createNormalizer('items'),
    request: {
      name: 'fetchSearchResults',
      query: { categories, page, query, sort },
    },
  },
})
fetchSearchResults.toString = () => 'fetchSearchResults'
