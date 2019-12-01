import { API_BASE_URL } from '../constants'

const createMarketplaceAPI = ({ baseUrl, prefix = '/api' }) => ({
  getDatasetById: ({ id }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/datasets/${id}`,
  }),
  getSolutionById: ({ id }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/solutions/${id}`,
  }),
  getToolById: ({ id }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/tools/${id}`,
  }),
  getTrainingMaterialById: ({ id }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/training-materials/${id}`,
  }),
  search: ({ categories, page, query, sort }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/item-search`,
    query: {
      categories,
      order: sort,
      page,
      q: query,
    },
  }),
})

export default createMarketplaceAPI({ baseUrl: API_BASE_URL })
