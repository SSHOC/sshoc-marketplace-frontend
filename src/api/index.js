import { API_BASE_URL } from '../constants'

const createMarketplaceAPI = ({ baseUrl, prefix = '/api' }) => ({
  getItemCategories: () => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/items-categories/`,
  }),
  getWorkflowById: ({ id }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/workflows/${id}`,
  }),
  getDatasetById: ({ id }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/datasets/${id}`,
  }),
  getPublicationById: ({ id }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/publications/${id}`,
  }),
  getToolById: ({ id }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/tools-services/${id}`,
  }),
  getTrainingMaterialById: ({ id }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/training-materials/${id}`,
  }),
  search: ({ categories, facets, page, query, sort }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/item-search`,
    query: {
      categories,
      ...Object.entries(facets || {}).reduce((acc, [key, values]) => {
        acc[`f.${key}`] = values
        return acc
      }, {}),
      order: sort,
      page,
      q: query,
    },
  }),
  searchConcepts: ({ page, query, types }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/concept-search`,
    query: {
      page,
      q: query,
      types,
    },
  }),
  userLogin: ({ username, password }) => ({
    baseUrl,
    method: 'post',
    path: `${prefix}/login`,
    body: {
      username,
      password,
    },
  }),
})

export const getErrorMessage = async response => {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    try {
      const { error: errorMessage } = (await response.json()) || {}
      if (errorMessage) {
        return [response.statusText, errorMessage].join(': ')
      }
    } catch (e) {}
  }

  return response.statusText
}

export default createMarketplaceAPI({ baseUrl: API_BASE_URL })
