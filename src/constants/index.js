export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || ''

// these are only used for storybook
export const ITEM_CATEGORY = {
  'tool-or-service': 'Tools & Services',
  'training-material': 'Training Materials',
  workflow: 'Workflow',
  dataset: 'Dataset',
  step: 'Steps',
  publication: 'Publications',
}

export const ITEM_FACETS = {
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
