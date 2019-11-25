import React from 'react'
import { useQueryParams } from '../../utils'

const SearchPage = () => {
  const queryParams = useQueryParams()

  const query = queryParams.get('q')
  const categories = queryParams.getAll('categories')
  const page = queryParams.get('page')
  const sortField = queryParams.get('order')

  return (
    <>
      <h1>
        Search for {query || 'everything'} in{' '}
        {categories.join(', ') || 'all categories'}, sorted by{' '}
        {sortField || 'label'} (page {page || 1})
      </h1>
    </>
  )
}

export default SearchPage
