import css from '@styled-system/css'
import React from 'react'
import { useHistory } from 'react-router-dom'
import 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Checkbox from '../../elements/Checkbox/Checkbox'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Link from '../../elements/Link/Link'
import Separator from '../../elements/Separator/Separator'
import { getSearchParams } from '../../utils/getSearchParams'

const CategoryCheckbox = ({ category, categories, label, onChange }) => (
  <Flex css={css({ justifyContent: 'space-between', my: 2 })}>
    <Checkbox
      checked={categories.includes(category)}
      onChange={onChange}
      value={category}
    >
      {label}
    </Checkbox>
  </Flex>
)

const SearchFacets = ({ categories, page, query, sortField }) => {
  const history = useHistory()

  const handleChangeCategories = event => {
    const updatedCategories = event.target.checked
      ? categories.concat(event.target.value)
      : categories.filter(category => category !== event.target.value)

    history.push(
      getSearchParams({
        categories: updatedCategories,
        page,
        query,
        sortField,
      })
    )
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
        <Link as="button" to="/search">
          Clear all
        </Link>
      </Flex>

      <Separator />

      {/* TODO: fieldset+legend */}
      <Heading as="h3" variant="h5" css={css({ mt: 4, mb: 3 })}>
        Categories
      </Heading>

      <CategoryCheckbox
        category="datasets"
        categories={categories}
        onChange={handleChangeCategories}
        label="Datasets"
      />
      <CategoryCheckbox
        category="solutions"
        categories={categories}
        onChange={handleChangeCategories}
        label="Solutions"
      />
      <CategoryCheckbox
        category="tools"
        categories={categories}
        onChange={handleChangeCategories}
        label="Tools"
      />
      <CategoryCheckbox
        category="training-materials"
        categories={categories}
        onChange={handleChangeCategories}
        label="Training Materials"
      />
    </Box>
  )
}

export default SearchFacets
