import css from '@styled-system/css'
import React, { useState, useEffect, useMemo } from 'react'
import 'styled-components/macro'
import Button from '../../elements/Button/Button'
import Flex from '../../elements/Flex/Flex'
import Input from '../../elements/Input/Input'
import Select from '../../elements/Select/Select'
import { useSearchParams } from '../../utils'
import { fetchItemCategories } from '../../store/actions/itemCategories'
import { useDispatch, useSelector } from 'react-redux'
import { selectors } from '../../store/reducers'

const SearchForm = props => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchItemCategories())
  }, [dispatch])

  const itemCategories = useSelector(state =>
    selectors.itemCategories.selectAllResources(state)
  )

  const categories = useMemo(
    () => [
      { label: 'All Categories', value: '' },
      ...Object.entries(itemCategories || {}).map(([value, label]) => ({
        label,
        value,
      })),
    ],
    [itemCategories]
  )

  const [, setSearchParams] = useSearchParams()
  const [category, setCategory] = useState(categories[0])
  const [query, setQuery] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    setSearchParams(
      {
        categories: category.value,
        query,
      },
      '/search'
    )
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
      {...props}
    >
      <Select
        aria-label="Categories"
        checkSelected
        css={{
          minWidth: 200,
        }}
        items={categories}
        onChange={setCategory}
        selectedItem={category}
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
