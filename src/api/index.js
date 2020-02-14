import { API_BASE_URL } from '../constants'

const createMarketplaceAPI = ({ baseUrl, prefix = '/api' }) => ({
  getDatasetById: ({ id }) => ({
    baseUrl,
    method: 'get',
    path: `${prefix}/datasets/${id}`,
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
