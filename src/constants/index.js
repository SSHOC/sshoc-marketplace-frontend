export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || ''

export const ITEM_CATEGORY = {
  tool: 'Tool',
  'training-material': 'Training Material',
  dataset: 'Dataset',
}

export const DEFAULT_SORT_FIELD = 'score'
export const SORT_FIELDS = {
  score: 'relevance',
  label: 'name',
  'modified-on': 'last modification',
}
