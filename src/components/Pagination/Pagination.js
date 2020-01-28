import css from '@styled-system/css'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import Chevron from '../../elements/Chevron/Chevron'
import Flex from '../../elements/Flex/Flex'
import Input from '../../elements/Input/Input'
import Link from '../../elements/Link/Link'
import { createPages } from '../../utils'

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
        aria-label="Jump to page"
        css={css({
          textAlign: 'right',
          width: '3em',
        })}
        disabled={disabled}
        max={totalPages}
        min={1}
        onChange={handleChange}
        placeholder={currentPage}
        type="number"
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
    pointerEvents: props.active ? 'none' : undefined,
  })
)

const Pagination = ({
  currentPage = 1,
  onPageChange,
  totalPages = 0,
  variant,
  ...props
}) => {
  if (currentPage < 1) {
    currentPage = 1
  } else if (currentPage > totalPages) {
    currentPage = totalPages
  }

  return (
    <Flex as="nav" css={{ alignItems: 'center' }} {...props}>
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
          createPages({ currentPage, totalPages }).map((page, i) => (
            <li key={i}>
              {page === 0 ? (
                <span css={css({ mx: 2 })}>&hellip;</span>
              ) : (
                <LinkButton
                  active={currentPage === page}
                  aria-label={`Page ${page}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </LinkButton>
              )}
            </li>
          ))
        ) : variant === 'input' ? (
          <li>
            <PageInput
              currentPage={currentPage}
              disabled={!totalPages || totalPages < 2}
              onPageChange={onPageChange}
              totalPages={totalPages}
            />
          </li>
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
    </Flex>
  )
}

export default Pagination
