export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || ''

export const ITEM_CATEGORY = {
  tool: 'Tool',
  'training-material': 'Training Material',
  workflow: 'Workflow',
  dataset: 'Dataset',
}

export const ITEM_FACETS = {
  'object-type': 'Types',
  activity: 'Activities',
  keyword: 'Keywords',
  source: 'Sources',
}

export const DEFAULT_SORT_FIELD = 'score'
export const SORT_FIELDS = {
  score: 'relevance',
  label: 'name',
  'modified-on': 'last modification',
}
