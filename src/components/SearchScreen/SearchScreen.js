import css from '@styled-system/css'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import SearchFacets from '../../components/SearchFacets/SearchFacets'
import SearchResults from '../../components/SearchResults/SearchResults'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import { fetchSearchResults } from '../../store/actions/items'
import { fetchItemCategories } from '../../store/actions/itemCategories'
import { selectors } from '../../store/reducers'

const SearchScreenContainer = ({ onSearchParamsChange, searchParams }) => {
  const dispatch = useDispatch()

  const { categories, facets, page, query, sort } = searchParams

  useEffect(() => {
    dispatch(fetchItemCategories())
  }, [dispatch])

  const itemCategories = useSelector(state =>
    selectors.itemCategories.selectAllResources(state)
  )

  const request = useSelector(state =>
    selectors.requests.selectRequestByName(state, {
      name: fetchSearchResults,
      query: {
        categories,
        facets,
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
  const facetsHash = JSON.stringify(facets)
  useEffect(() => {
    dispatch(
      fetchSearchResults({
        categories,
        facets,
        page,
        query,
        sort,
      })
    )
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [categoriesHash, dispatch, facetsHash, page, query, sort])

  return (
    <SearchScreen
      collection={collection}
      onSearchParamsChange={onSearchParamsChange}
      request={request}
      results={results}
      searchParams={searchParams}
      itemCategories={itemCategories}
    />
  )
}

const SearchResultsCount = ({ count }) =>
  count ? <span css={css({ fontSize: 6 })}>({count})</span> : null

const Sidebar = styled('aside')(
  css({
    flexBasis: 'sidebar',
    flexGrow: 0,
    flexShrink: 1,
    pr: 4,
  })
)

export const SearchScreen = ({
  collection,
  onSearchParamsChange,
  request,
  results,
  searchParams,
  itemCategories,
}) => (
  <>
    <Heading variant="h1" css={css({ mt: 4 })}>
      Search results{' '}
      <SearchResultsCount count={request.info?.hits ?? collection.info?.hits} />
    </Heading>
    <Flex css={css({ height: '100%', my: 6 })}>
      <Sidebar>
        <SearchFacets
          collection={collection}
          onSearchParamsChange={onSearchParamsChange}
          request={request}
          searchParams={searchParams}
        />
      </Sidebar>
      <SearchResults
        css={{ flex: 3 }}
        onSearchParamsChange={onSearchParamsChange}
        request={request}
        results={results}
        searchParams={searchParams}
        itemCategories={itemCategories}
      />
    </Flex>
  </>
)

export default SearchScreenContainer
