export const getSearchParams = ({ categories, page, query, sortField }) => {
  const queryParams = new URLSearchParams()

  if (categories) {
    if (Array.isArray(categories)) {
      categories
        .slice()
        .sort()
        .forEach(category => queryParams.append('categories', category))
    } else {
      queryParams.set('categories', categories)
    }
  }
  if (page) {
    queryParams.set('page', page)
  }
  if (query) {
    queryParams.set('q', query)
  }
  if (sortField && sortField !== 'score') {
    queryParams.set('order', sortField)
  }

  queryParams.sort()

  return `/search?${queryParams.toString()}`
}
