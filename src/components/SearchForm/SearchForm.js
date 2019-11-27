import css from '@styled-system/css'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import 'styled-components/macro'
import Button from '../../elements/Button/Button'
import Flex from '../../elements/Flex/Flex'
import Input from '../../elements/Input/Input'
import Select from '../../elements/Select/Select'

const SearchForm = () => {
  const history = useHistory()

  const [category, setCategory] = useState('')
  const [query, setQuery] = useState('')

  const handleSubmit = event => {
    event.preventDefault()

    const queryParams = new URLSearchParams()
    if (category) {
      queryParams.set('categories', category)
    }
    if (query) {
      queryParams.set('q', query)
    }

    history.push(`/search?${queryParams.toString()}`)
  }

  return (
    <Flex
      as="form"
      css={css({
        bg: 'background',
        borderRadius: 3,
        boxShadow: 'medium',
        my: 4,
        px: 4,
        py: 2,
      })}
      onSubmit={handleSubmit}
      role="search"
    >
      <Select
        aria-label="Categories"
        checkSelected
        css={{
          minWidth: 200,
        }}
        items={[
          { label: 'All Categories', value: '' },
          { label: 'Datasets', value: 'datasets' },
          { label: 'Solutions', value: 'solutions' },
          { label: 'Tools', value: 'tools' },
          { label: 'Training Materials', value: 'training-materials' },
        ]}
        onChange={category => setCategory(category.value)}
      />
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

export default SearchForm
