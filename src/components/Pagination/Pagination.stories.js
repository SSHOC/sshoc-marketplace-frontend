import React from 'react'
import Pagination from './Pagination'
import Stack from '../../elements/Stack/Stack'
import 'styled-components/macro'

export default {
  title: 'Components|Pagination',
}

export const variants = () => (
  <Stack css={{ '& > *': { flexBasis: 60 } }}>
    <Pagination currentPage={1} totalPages={3} />
    <Pagination currentPage={1} totalPages={3} variant="input" />
    <Pagination currentPage={1} totalPages={3} variant="links" />
  </Stack>
)

export const empty = () => (
  <Stack css={{ '& > *': { flexBasis: 60 } }}>
    <Pagination currentPage={1} totalPages={undefined} />
    <Pagination currentPage={1} totalPages={undefined} variant="input" />
    <Pagination currentPage={1} totalPages={undefined} variant="links" />
  </Stack>
)

export const one = () => (
  <Stack css={{ '& > *': { flexBasis: 60 } }}>
    <Pagination currentPage={1} totalPages={1} />
    <Pagination currentPage={1} totalPages={1} variant="input" />
    <Pagination currentPage={1} totalPages={1} variant="links" />
  </Stack>
)

export const many = () => (
  <Stack css={{ '& > *': { flexBasis: 60 } }}>
    <Pagination currentPage={1} totalPages={100} />
    <Pagination currentPage={1} totalPages={100} variant="input" />
    <Pagination currentPage={1} totalPages={100} variant="links" />
  </Stack>
)
