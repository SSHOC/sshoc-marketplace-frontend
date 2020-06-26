import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import { DEFAULT_SORT_FIELD, SORT_FIELDS } from '../../constants'
import Centered from '../../elements/Centered/Centered'
import Flex from '../../elements/Flex/Flex'
import Select from '../../elements/Select/Select'
import Stack from '../../elements/Stack/Stack'
import { REQUEST_STATUS } from '../../store/constants'
import { range } from '../../utils'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import Pagination from '../Pagination/Pagination'
import SearchResult, {
  SearchResultPlaceholder,
} from '../SearchResult/SearchResult'

const sortFields = Object.entries(SORT_FIELDS).map(([value, label]) => ({
  value,
  label: `Sort by ${label}`,
}))

const SortSelect = ({ onSortChange, sort }) => {
  const currentSortField =
    sortFields.find(field => field.value === sort) ||
    sortFields.find(field => field.value === DEFAULT_SORT_FIELD)

  return (
    <Select
      aria-label="Search results sort order"
      css={{ minWidth: 265 }}
      items={sortFields}
      onChange={onSortChange}
      selectedItem={currentSortField}
    />
  )
}

const SearchResultsHeader = ({
  info,
  onPageChange,
  onSortChange,
  page,
  sort,
}) => (
  <Flex
    css={css({
      alignItems: 'center',
      flexBasis: 'row',
      flexGrow: 0,
      flexShrink: 0,
      justifyContent: 'space-between',
    })}
  >
    <SortSelect onSortChange={onSortChange} sort={sort} />
    <Pagination
      aria-label="Search results pages"
      currentPage={page}
      onPageChange={onPageChange}
      totalPages={info.pages}
      variant="input"
    />
  </Flex>
)

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
        <ErrorMessage level="error">{request.error?.message}</ErrorMessage>
      </Centered>
    )
  }

  if (request.status === REQUEST_STATUS.SUCCEEDED) {
    return (
      <Centered>
        <ErrorMessage level="info">Nothing found</ErrorMessage>
      </Centered>
    )
  }

  return null
}

const SearchResults = ({
  className,
  onSearchParamsChange,
  request,
  results,
  searchParams,
}) => {
  const { categories, page, query, sort, facets } = searchParams

  const handlePageChange = page => {
    onSearchParamsChange({
      categories,
      page,
      query,
      sort,
      facets
    })
  }

  const handleSortChange = sort => {
    onSearchParamsChange({
      categories,
      // TODO: should we reset page when sort order changes or not?
      // page,
      query,
      sort: sort.value,
      facets,
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
        aria-label="Search results pages"
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
