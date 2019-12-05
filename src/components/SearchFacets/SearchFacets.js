import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import { ITEM_CATEGORY } from '../../constants'
import Box from '../../elements/Box/Box'
import Checkbox from '../../elements/Checkbox/Checkbox'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Link from '../../elements/Link/Link'
import Separator from '../../elements/Separator/Separator'
import { useQueryParams } from '../../utils'

const CategoryCheckbox = ({ category, categories, count, label, onChange }) => (
  <Flex css={css({ justifyContent: 'space-between', my: 2 })}>
    <Checkbox
      checked={categories.includes(category)}
      onChange={onChange}
      value={category}
    >
      {label} {count ? `(${count.count})` : null}
    </Checkbox>
  </Flex>
)

const SearchFacets = ({ categories, count, page, query, sort }) => {
  const [queryParams, setQueryParams] = useQueryParams()

  const handleChangeCategories = event => {
    const updatedCategories = event.target.checked
      ? categories.concat(event.target.value)
      : categories.filter(category => category !== event.target.value)

    // Always reset to first page, so we don't end up on a page larger
    // than Math.ceil((results.length / pageSize)) when deselecting a category
    setQueryParams({
      categories: updatedCategories,
      page: undefined,
      query,
      sort,
    })
  }

  return (
    <Box as="form">
      <Flex
        css={css({
          alignItems: 'center',
          height: 80,
          justifyContent: 'space-between',
        })}
      >
        <Heading as="h2" variant="h3">
          Refine your search
        </Heading>
        {/* TODO: should probably be <button></button> */}
        {/* TODO: should this clear the search box as well? */}
        <Link to="/search">Clear all</Link>
      </Flex>

      <Separator />

      {/* TODO: fieldset+legend */}
      <Heading as="h3" variant="h5" css={css({ mt: 4, mb: 3 })}>
        Categories
      </Heading>

      {Object.entries(ITEM_CATEGORY).map(([category, label]) => (
        <CategoryCheckbox
          category={category}
          categories={categories}
          count={count[category]}
          key={category}
          onChange={handleChangeCategories}
          label={label}
        />
      ))}
    </Box>
  )
}

export default SearchFacets
