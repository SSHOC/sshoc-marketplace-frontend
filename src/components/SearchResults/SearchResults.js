import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Centered from '../../elements/Centered/Centered'
import Flex from '../../elements/Flex/Flex'
import Select from '../../elements/Select/Select'
import Stack from '../../elements/Stack/Stack'
import Text from '../../elements/Text/Text'
import { REQUEST_STATUS } from '../../store/constants'
import { range } from '../../utils'
import Pagination from '../Pagination/Pagination'
import SearchResult, {
  SearchResultPlaceholder,
} from '../SearchResult/SearchResult'

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
        variant="input"
      />
    </Flex>
  )
}

const SearchResultsList = ({ request, results }) => {
  if (results && results.length) {
    return (
      <Stack as="ul">
        {results.map(result => (
          <li key={result.id}>
            <SearchResult result={result} />
          </li>
        ))}
      </Stack>
    )
  }

  // We also show loading state on idle to avoid flashing empty space
  if ([REQUEST_STATUS.IDLE, REQUEST_STATUS.PENDING].includes(request.status)) {
    return (
      <Stack as="ul" aria-busy aria-live="polite">
        {range(10).map(i => (
          <li key={`_placeholder${i}`}>
            <SearchResultPlaceholder />
          </li>
        ))}
      </Stack>
    )
  }

  if (request.status === REQUEST_STATUS.FAILED) {
    return (
      <Centered>
        <Text>Oh no! {request.error ? request.error.message : null}</Text>
      </Centered>
    )
  }

  if (request.status === REQUEST_STATUS.SUCCEEDED) {
    return (
      <Centered>
        <Text>Nothing found</Text>
      </Centered>
    )
  }

  return null
}

const SearchResults = ({
  className,
  request,
  results,
  searchParams,
  setSearchParams,
}) => {
  const { categories, page, query, sort } = searchParams

  const handlePageChange = page => {
    setSearchParams({
      categories,
      page,
      query,
      sort,
    })
  }

  const handleSortChange = sort => {
    setSearchParams({
      categories,
      page,
      query,
      sort: sort.value,
    })
  }

  return (
    <Stack className={className}>
      <SearchResultsHeader
        info={request.info}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        page={page}
        sort={sort}
      />
      <SearchResultsList request={request} results={results} />
      <Pagination
        css={css({ alignSelf: 'flex-end', my: 4 })}
        currentPage={page}
        onPageChange={page => {
          handlePageChange(page)
          window.scrollTo(0, 0)
        }}
        totalPages={request.info.pages}
        variant="links"
      />
    </Stack>
  )
}

export default SearchResults
