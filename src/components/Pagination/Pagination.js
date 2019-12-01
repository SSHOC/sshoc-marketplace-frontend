import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Chevron from '../../elements/Chevron/Chevron'
import Flex from '../../elements/Flex/Flex'
import Link from '../../elements/Link/Link'

const Pagination = ({ currentPage, onPageChange, totalPages, ...props }) => (
  <Box as="nav" {...props}>
    <Flex css={css({ listStyle: 'none', m: 0, p: 0 })} as="ol">
      <li>
        <Link
          as="button"
          css={css({ alignItems: 'center', display: 'inline-flex', mr: 2 })}
          disabled={(currentPage || 1) < 2}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
        >
          <Chevron direction="left" /> Prev
        </Link>
      </li>
      <li>
        <Link
          as="button"
          css={css({ alignItems: 'center', display: 'inline-flex', ml: 2 })}
          disabled={(currentPage || 1) >= totalPages || !totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          Next <Chevron direction="right" />
        </Link>
      </li>
    </Flex>
  </Box>
)

export default Pagination
