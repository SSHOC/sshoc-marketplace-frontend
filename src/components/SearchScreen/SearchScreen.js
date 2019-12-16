import css from '@styled-system/css'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import SearchFacets from '../../components/SearchFacets/SearchFacets'
import SearchResults from '../../components/SearchResults/SearchResults'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import { fetchSearchResults } from '../../store/actions/items'
import { selectors } from '../../store/reducers'

const SearchScreenContainer = ({ searchParams, setSearchParams }) => {
  const dispatch = useDispatch()

  const { categories, page, query, sort } = searchParams

  const request = useSelector(state =>
    selectors.requests.selectRequestByName(state, {
      name: fetchSearchResults,
      query: {
        categories,
        page,
        query,
        sort,
      },
    })
  )
  const collection = useSelector(state =>
    selectors.itemCollections.selectCollectionByName(state, {
      name: fetchSearchResults,
      query: {
        categories,
        query,
        sort,
      },
    })
  )
  const results = useSelector(state =>
    selectors.items.selectResources(state, request.resources.items)
  )

  // useEffect does shallow equality check, so we serialize the array
  // alternatively, use custom hook for something more linter-friendly,
  // or just use useDeepCompareEffect
  const categoriesHash = JSON.stringify(categories)
  useEffect(() => {
    dispatch(
      fetchSearchResults({
        categories,
        page,
        query,
        sort,
      })
    )
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [categoriesHash, dispatch, page, query, sort])

  return (
    <SearchScreen
      collection={collection}
      request={request}
      results={results}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
    />
  )
}

const SearchResultsCount = ({ count }) =>
  count ? <span css={css({ fontSize: 6 })}>({count})</span> : null

const Sidebar = styled('aside')(
  css({
    flex: 1,
    minWidth: 'sidebar',
    pr: 4,
  })
)

export const SearchScreen = ({
  collection,
  request,
  results,
  searchParams,
  setSearchParams,
}) => (
  <>
    <Heading variant="h1" css={css({ mt: 4 })}>
      Search results{' '}
      <SearchResultsCount count={request.info?.hits ?? collection.info?.hits} />
    </Heading>
    <Flex css={css({ mt: 6 })}>
      <Sidebar>
        <SearchFacets
          collection={collection}
          request={request}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      </Sidebar>
      <SearchResults
        css={{ flex: 3 }}
        request={request}
        results={results}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </Flex>
  </>
)

export default SearchScreenContainer
