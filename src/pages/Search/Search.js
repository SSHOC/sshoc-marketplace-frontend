import css from '@styled-system/css'
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'styled-components/macro'
import SearchBar from '../../components/SearchBar/SearchBar'
import SearchFacets from '../../components/SearchFacets/SearchFacets'
import SearchResults from '../../components/SearchResults/SearchResults'
import Breadcrumbs from '../../elements/Breadcrumbs/Breadcrumbs'
import Centered from '../../elements/Centered/Centered'
import Container from '../../elements/Container/Container'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Main from '../../elements/Main/Main'
import Spinner from '../../elements/Spinner/Spinner'
import Stack from '../../elements/Stack/Stack'
import Text from '../../elements/Text/Text'
import BackgroundImage from '../../images/bg_search.png'
import BackgroundImageHiDPI from '../../images/bg_search@2x.png'
import { fetchSearchResults } from '../../store/actions/items'
import { REQUEST_STATUS } from '../../store/constants'
import { selectors } from '../../store/reducers'
import { useNavigationFocus, useQueryParams } from '../../utils'

const TotalSearchResults = ({ request }) =>
  request.info && request.info.hits != null ? (
    <span css={css({ fontSize: 6 })}>({request.info.hits})</span>
  ) : null

const SearchPage = () => {
  const dispatch = useDispatch()
  const focusRef = useNavigationFocus()
  const [queryParams] = useQueryParams()

  const { categories, page, query, sort } = useMemo(
    () => ({
      categories: queryParams.getAll('categories'),
      page: queryParams.get('page'),
      query: queryParams.get('query'),
      sort: queryParams.get('sort'),
    }),
    [queryParams]
  )

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
    <Main
      css={{
        // TODO: Proper media query, or use <img srcset /> or <picture />
        backgroundImage: `url(${
          window.devicePixelRatio >= 1 ? BackgroundImageHiDPI : BackgroundImage
        })`,
        backgroundSize: 'contain',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
      ref={focusRef}
    >
      <Container as={Flex} css={{ flexDirection: 'column' }}>
        <SearchBar
          categories={categories}
          css={{ alignSelf: 'flex-end', width: '50%' }}
          page={page}
          query={query}
          sort={sort}
        />
        <Breadcrumbs
          paths={[{ label: 'Home', value: '/' }, { label: 'Search results' }]}
        />
        <Heading variant="h1" css={css({ mt: 4 })}>
          Search results <TotalSearchResults request={request} />
        </Heading>
        <Flex css={css({ mt: 6 })}>
          <aside
            css={css({
              flex: 1,
              minWidth: 'sidebar',
              pr: 4,
            })}
          >
            <SearchFacets
              categories={categories}
              count={(request.info && request.info.categories) || {}}
              page={page}
              query={query}
              sort={sort}
            />
          </aside>
          <Stack css={{ flex: 3 }}>
            {results && results.length ? (
              <SearchResults
                categories={categories}
                info={request.info}
                page={page}
                query={query}
                results={results}
                sort={sort}
              />
            ) : request.status === REQUEST_STATUS.PENDING ? (
              <Centered css={css({ color: 'primary' })}>
                <Spinner
                  aria-label="Loading"
                  delayed
                  height="6em"
                  width="6em"
                />
              </Centered>
            ) : request.status === REQUEST_STATUS.FAILED ? (
              <Centered>
                <Text>
                  Oh no! {request.error ? request.error.message : null}
                </Text>
              </Centered>
            ) : request.status === REQUEST_STATUS.SUCCEEDED ? (
              <Centered>
                <Text>Nothing found</Text>
              </Centered>
            ) : null}
          </Stack>
        </Flex>
      </Container>
    </Main>
  )
}

export default SearchPage
