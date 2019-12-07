import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Flex from '../../elements/Flex/Flex'
import Select from '../../elements/Select/Select'
import Stack from '../../elements/Stack/Stack'
import Pagination from '../Pagination/Pagination'
import SearchResult from '../SearchResult/SearchResult'

const SearchResultsHeader = ({
  info,
  onPageChange,
  onSortChange,
  page,
  sort,
}) => {
  const sortFields = [
    { value: '', label: 'Sort by score' },
    { value: 'label', label: 'Sort by name' },
    { value: 'modified-on', label: 'Sort by last modification' },
  ]
  const currentSortField = sortFields.find(field => field.value === sort)

  return (
    <Flex
      as="form"
      css={css({
        alignItems: 'center',
        height: 80,
        justifyContent: 'space-between',
      })}
    >
      <Select
        css={{ minWidth: 265 }}
        initialValue={currentSortField}
        items={sortFields}
        onChange={onSortChange}
      />
      <Pagination
        currentPage={page}
        onPageChange={onPageChange}
        totalPages={info.pages}
      />
    </Flex>
  )
}

const SearchResults = ({
  categories,
  info,
  page,
  query,
  results,
  setQueryParams,
  sort,
}) => {
  const handlePageChange = page => {
    setQueryParams({
      categories,
      page,
      query,
      sort,
    })
  }

  const handleSortChange = sort => {
    setQueryParams({
      categories,
      page,
      query,
      sort: sort.value,
    })
  }

  return (
    <>
      <SearchResultsHeader
        info={info}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        page={page}
        sort={sort}
      />
      <Stack as="ul">
        {results.map(result => (
          <li key={result.id}>
            <SearchResult result={result} />
          </li>
        ))}
      </Stack>
      <Pagination
        css={css({ alignSelf: 'flex-end', my: 4 })}
        currentPage={page}
        onPageChange={page => {
          handlePageChange(page)
          window.scrollTo(0, 0)
        }}
        totalPages={info.pages}
      />
    </>
  )
}

export default SearchResults
