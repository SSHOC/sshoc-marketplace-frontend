import css from '@styled-system/css'
import React, { Fragment } from 'react'
import 'styled-components/macro'
import { ITEM_CATEGORY, ITEM_FACETS } from '../../constants'
import Box from '../../elements/Box/Box'
import Checkbox from '../../elements/Checkbox/Checkbox'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Link from '../../elements/Link/Link'
import Separator from '../../elements/Separator/Separator'
import { pluralize } from '../../utils'

const CategoryCheckbox = ({
  category,
  categories,
  collection,
  info,
  label,
  onChange,
}) => {
  const count =
    info?.categories?.[category]?.count ??
    collection.info?.categories?.[category]?.count

  return (
    <Flex css={css({ justifyContent: 'space-between', my: 2, fontSize: 15 })}>
      <Checkbox
        checked={categories.includes(category)}
        onChange={onChange}
        value={category}
      >
        {pluralize(label)} {count ? `(${count})` : null}
      </Checkbox>
    </Flex>
  )
}

const FacetCheckbox = ({ checked, count, label, name, onChange }) => (
  <Flex css={css({ justifyContent: 'space-between', my: 2, fontSize: 15 })}>
    <Checkbox checked={checked} name={name} onChange={onChange} value={label}>
      {label} ({count})
    </Checkbox>
  </Flex>
)

const SearchFacets = ({
  collection,
  onSearchParamsChange,
  request,
  searchParams,
}) => {
  const { categories, facets, query, sort } = searchParams
  const { info } = request || {}
  const possibleFacets = info?.facets || collection?.info?.facets || {}

  const handleChangeCategories = event => {
    const { checked, value } = event.target

    const updatedCategories = checked
      ? categories.concat(value)
      : categories.filter(category => category !== value)

    // Always reset to first page, so we don't end up on a page larger
    // than Math.ceil((results.length / pageSize)) when deselecting a category
    // Also reset facets, so we don't have stale values that will always
    // produce an empty result set because they are invalid for the selected categories
    onSearchParamsChange({
      categories: updatedCategories,
      // facets,
      // page,
      query,
      sort,
    })
  }

  const handleFacetChange = event => {
    const { checked, name, value } = event.target

    const prevFacet = facets[name] || []
    const nextFacet = checked
      ? prevFacet.concat(value)
      : prevFacet.filter(f => f !== value)

    const nextFacets = {
      ...facets,
      [name]: [...new Set(nextFacet)].sort(),
    }

    if (!nextFacet.length) {
      delete nextFacets[name]
    }

    onSearchParamsChange({
      categories,
      facets: nextFacets,
      // page,
      query,
      sort,
    })
  }

  return (
    <Box as="form">
      <Flex
        css={css({
          alignItems: 'center',
          height: 'row',
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
      <Heading
        as="h3"
        variant="h5"
        css={css({ my: 4, textTransform: 'uppercase' })}
      >
        Categories
      </Heading>

      {Object.entries(ITEM_CATEGORY).map(([category, label]) => (
        <CategoryCheckbox
          category={category}
          categories={categories}
          collection={collection}
          info={info}
          key={category}
          label={label}
          onChange={handleChangeCategories}
        />
      ))}

      {Object.entries(possibleFacets).map(([key, value], i, arr) => {
        const checkedFacets = facets[key] || []
        const facetCount = Object.keys(value).length

        return (
          <Fragment key={key}>
            {facetCount ? (
              <Fragment>
                <Separator css={css({ my: 4 })} />
                <Heading
                  as="h3"
                  variant="h5"
                  css={css({ my: 4, textTransform: 'uppercase' })}
                >
                  {ITEM_FACETS[key]}
                </Heading>
              </Fragment>
            ) : null}

            {Object.entries(value).map(([label, { count, checked }]) => (
              <FacetCheckbox
                // we use the URL state for `checked`, not the server response,
                // so we don't need to wait for the backend to change the checkbox state
                checked={checkedFacets.includes(label)}
                count={count}
                key={label}
                label={label}
                name={key}
                onChange={handleFacetChange}
              />
            ))}
          </Fragment>
        )
      })}
    </Box>
  )
}

export default SearchFacets
