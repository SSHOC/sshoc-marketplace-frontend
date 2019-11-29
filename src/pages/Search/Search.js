import css from '@styled-system/css'
import React from 'react'
// import { useSelector } from 'react-redux'
import 'styled-components/macro'
import SearchBar from '../../components/SearchBar/SearchBar'
import SearchFacets from '../../components/SearchFacets/SearchFacets'
import SearchResults from '../../components/SearchResults/SearchResults'
import Breadcrumbs from '../../elements/Breadcrumbs/Breadcrumbs'
import Container from '../../elements/Container/Container'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Main from '../../elements/Main/Main'
import BackgroundImage from '../../images/bg_search.png'
import BackgroundImageHiDPI from '../../images/bg_search@2x.png'
import { useNavigationFocus, useQueryParams } from '../../utils'

const SearchPage = () => {
  const focusRef = useNavigationFocus()

  const queryParams = useQueryParams()

  const categories = queryParams.getAll('categories')
  const page = queryParams.get('page')
  const query = queryParams.get('q')
  const sortField = queryParams.get('order')

  // FIXME:
  const results = []

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
          sortField={sortField}
        />
        <Breadcrumbs
          paths={[{ label: 'Home', value: '/' }, { label: 'Search results' }]}
        />
        <Heading variant="h1" css={css({ mt: 3 })}>
          Search results <span css={css({ fontSize: 6 })}>()</span>
        </Heading>
        <Flex css={css({ mt: 5 })}>
          <aside css={css({ flex: 1, minWidth: 'sidebar', pr: 4 })}>
            <SearchFacets
              categories={categories}
              page={page}
              query={query}
              sortField={sortField}
            />
          </aside>
          <div css={{ flex: 3 }}>
            <SearchResults
              categories={categories}
              page={page}
              query={query}
              results={results}
              sortField={sortField}
            />
          </div>
        </Flex>
      </Container>
    </Main>
  )
}

export default SearchPage
