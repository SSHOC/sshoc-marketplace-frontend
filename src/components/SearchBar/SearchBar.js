import css from '@styled-system/css'
import React, { useState } from 'react'
import 'styled-components/macro'
import Button from '../../elements/Button/Button'
import Flex from '../../elements/Flex/Flex'
import Input from '../../elements/Input/Input'
import { useQueryParams } from '../../utils'

const SearchBar = ({
  categories,
  page,
  query: currentQuery,
  sort,
  ...props
}) => {
  const [queryParams, setQueryParams] = useQueryParams()
  const [query, setQuery] = useState(currentQuery || '')

  const handleSubmit = event => {
    event.preventDefault()
    setQueryParams({ query }, '/search')
  }

  return (
    <Flex
      as="form"
      css={css({ my: 2 })}
      onSubmit={handleSubmit}
      role="search"
      {...props}
    >
      <Input
        aria-label="Search term"
        css={css({ flex: 1, mx: 1 })}
        onChange={event => setQuery(event.target.value)}
        placeholder="Search&hellip;"
        type="search"
        value={query}
      />
      <Button css={css({ px: 4 })} type="submit" variant="fancy">
        Search
      </Button>
    </Flex>
  )
}

export default SearchBar
