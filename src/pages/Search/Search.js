import React from 'react'
import { useQueryParams } from '../../utils'
import Container from '../../elements/Container/Container'

const SearchPage = () => {
  const queryParams = useQueryParams()

  const query = queryParams.get('q')
  const categories = queryParams.getAll('categories')
  const page = queryParams.get('page')
  const sortField = queryParams.get('order')

  return (
    <Container>
      <h1>
        Search for {query || 'everything'} in{' '}
        {categories.join(', ') || 'all categories'}, sorted by{' '}
        {sortField || 'label'} (page {page || 1})
      </h1>
    </Container>
  )
}

export default SearchPage
