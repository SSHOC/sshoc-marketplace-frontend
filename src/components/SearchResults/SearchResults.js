import css from '@styled-system/css'
import React from 'react'
import { useHistory } from 'react-router-dom'
import 'styled-components/macro'
import Badge from '../../elements/Badge/Badge'
import Box from '../../elements/Box/Box'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Icon from '../../elements/Icon/Icon'
import Link from '../../elements/Link/Link'
import Select from '../../elements/Select/Select'
import Stack from '../../elements/Stack/Stack'
import Text from '../../elements/Text/Text'
import { getSearchParams } from '../../utils/getSearchParams'
import { ITEM_CATEGORIES } from '../../constants'

const SearchResultsHeader = ({ categories, page, query, sortField }) => {
  const history = useHistory()

  const handleChangeSort = sort => {
    history.push(
      getSearchParams({
        categories,
        page,
        query,
        sortField: sort.value,
      })
    )
  }

  const sortFields = [
    { value: 'score', label: 'Sort by score' },
    { value: 'name', label: 'Sort by name' },
    { value: 'modified-on', label: 'Sort by last modification' },
  ]
  const currentSortField = sortFields.find(field => field.value === sortField)

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
        onChange={handleChangeSort}
      />
    </Flex>
  )
}

const SearchResultsList = ({ results = [] }) => (
  <Stack as="ul">
    {results.map(result => (
      <li key={result.id}>
        <SearchResult result={result} />
      </li>
    ))}
  </Stack>
)

const SearchResult = ({ result }) => (
  <Flex
    css={css({
      bg: 'subtler',
      p: 4,
      mb: 1,
      position: 'relative',
      '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '100%',
        height: '100%',
        width: '100vw',
        bg: 'inherit',
      },
    })}
  >
    <Box css={{ flexBasis: 80, flexGrow: 0 }}>
      <Icon icon={result.category} width="3em" height="3em" />
    </Box>
    <Box css={{ flex: 1 }}>
      <Flex
        css={css({
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        })}
      >
        <Link to={`/${result.category}s/${result.id}`}>
          <Heading as="h3" variant="h4">
            {result.label}
          </Heading>
        </Link>
        <Badge>{ITEM_CATEGORIES[result.category]}</Badge>
      </Flex>
      <Box css={css({ my: 2 })}>
        <Text css={css({ color: 'grey.900' })} variant="small">
          <span css={css({ color: 'grey.800' })}>Contributors: </span>
          {(result.contributors || [])
            .map(contributor => contributor.actor.name)
            .join(', ')}
        </Text>
        <Text css={css({ color: 'grey.400' })} variant="small">
          <span>More Metadata: </span>
          What goes here?
        </Text>
      </Box>
      <Text css={css({ fontSize: 1, my: 3 })}>{result.description}</Text>
      <Flex css={css({ justifyContent: 'flex-end' })}>
        <Link to={`/${result.category}s/${result.id}`}>Read more</Link>
      </Flex>
    </Box>
  </Flex>
)

const SearchResults = ({ categories, page, query, results, sortField }) => {
  return (
    <>
      <SearchResultsHeader
        categories={categories}
        page={page}
        query={query}
        sortField={sortField}
      />
      <SearchResultsList results={results} />
    </>
  )
}

export default SearchResults
