import css from '@styled-system/css'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Chevron from '../../elements/Chevron/Chevron'
import Flex from '../../elements/Flex/Flex'
import Input from '../../elements/Input/Input'
import Link from '../../elements/Link/Link'
import { range } from '../../utils'

const MAX_PAGES = 10

const getPages = (currentPage, totalPages, maxPages = MAX_PAGES) => {
  if (!totalPages || totalPages < 2) return []

  let firstPage = 1
  let lastPage = totalPages

  if (totalPages > maxPages) {
    const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2)
    const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2)

    if (currentPage <= maxPagesBeforeCurrentPage) {
      lastPage = maxPages
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      firstPage = totalPages - maxPages + 1
    } else {
      firstPage = currentPage - maxPagesBeforeCurrentPage
      lastPage = currentPage + maxPagesAfterCurrentPage
    }
  }

  return range(lastPage + 1 - firstPage).map(page => page + firstPage)
}

const PageInput = ({ currentPage, disabled, onPageChange, totalPages }) => {
  const [page, setPage] = useState(currentPage)

  useEffect(() => {
    setPage(currentPage)
  }, [currentPage])

  const handleChange = event => {
    const selectedPage = parseInt(event.target.value, 10)

    // TODO: Should we prevent entering invalid page numbers, i.e. > totalPages?
    if (Number.isInteger(selectedPage)) {
      setPage(selectedPage)
    }
  }

  const handleSubmit = event => {
    event.preventDefault()

    if (page > totalPages) {
      onPageChange(totalPages)
    } else if (page < 0) {
      onPageChange(1)
    } else {
      onPageChange(page)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        disabled={disabled}
        css={css({
          textAlign: 'right',
          width: '3em',
        })}
        onChange={handleChange}
        placeholder={currentPage}
        value={page}
      />
    </form>
  )
}

const LinkButton = styled(Link).attrs({ as: 'button', type: 'button' })(props =>
  css({
    alignItems: 'center',
    borderBottomColor: props.active ? 'primary' : 'transparent',
    borderBottomStyle: 'solid',
    borderBottomWidth: 2,
    display: 'inline-flex',
    mx: 2,
  })
)

const Pagination = ({
  currentPage,
  onPageChange,
  totalPages,
  variant,
  ...props
}) => {
  if (currentPage < 1) {
    currentPage = 1
  } else if (currentPage > totalPages) {
    currentPage = totalPages
  }

  return (
    <Box aria-label="Search results pages" as="nav" {...props}>
      <Flex
        css={css({ alignItems: 'center', listStyle: 'none', m: 0, p: 0 })}
        as="ol"
      >
        <li>
          <LinkButton
            aria-label="Previous page"
            disabled={currentPage < 2}
            onClick={() => {
              if (currentPage > 1) {
                onPageChange(currentPage - 1)
              }
            }}
            rel="prev"
          >
            <Chevron direction="left" /> Prev
          </LinkButton>
        </li>
        {variant === 'links' ? (
          getPages(currentPage, totalPages).map(page => (
            <li key={page}>
              <LinkButton
                active={currentPage === page}
                aria-label={`Page ${page}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </LinkButton>
            </li>
          ))
        ) : variant === 'input' ? (
          <PageInput
            currentPage={currentPage}
            disabled={!totalPages || totalPages < 2}
            onPageChange={onPageChange}
            totalPages={totalPages}
          />
        ) : null}
        <li>
          <LinkButton
            aria-label="Next page"
            disabled={currentPage >= totalPages || !totalPages}
            onClick={() => {
              if (totalPages && totalPages > currentPage) {
                onPageChange(currentPage + 1)
              }
            }}
            rel="next"
          >
            Next <Chevron direction="right" />
          </LinkButton>
        </li>
      </Flex>
    </Box>
  )
}

export default Pagination
