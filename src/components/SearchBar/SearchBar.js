import css from '@styled-system/css'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import 'styled-components/macro'
import Button from '../../elements/Button/Button'
import Flex from '../../elements/Flex/Flex'
import Input from '../../elements/Input/Input'
import { getSearchParams } from '../../utils/getSearchParams'

const SearchBar = ({
  categories,
  page,
  query: currentQuery,
  sortField,
  ...props
}) => {
  const history = useHistory()

  const [query, setQuery] = useState(currentQuery || '')

  const handleSubmit = event => {
    event.preventDefault()

    history.push(
      getSearchParams({
        // categories,
        // page,
        query,
        // sortField,
      })
    )
  }

  return (
    <Flex as="form" onSubmit={handleSubmit} role="search" {...props}>
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
