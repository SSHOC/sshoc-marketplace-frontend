import React from 'react'
import { useQueryParams } from '../../utils'
import Container from '../../elements/Container/Container'
import Main from '../../elements/Main/Main'
import { useNavigationFocus } from '../../utils'

const SearchPage = () => {
  const focusRef = useNavigationFocus()
  const queryParams = useQueryParams()

  const query = queryParams.get('q')
  const categories = queryParams.getAll('categories')
  const page = queryParams.get('page')
  const sortField = queryParams.get('order')

  return (
    <Main ref={focusRef}>
      <Container>
        <h1>
          Search for {query || 'everything'} in{' '}
          {categories.join(', ') || 'all categories'}, sorted by{' '}
          {sortField || 'label'} (page {page || 1})
        </h1>
      </Container>
    </Main>
  )
}

export default SearchPage
