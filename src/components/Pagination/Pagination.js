import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Chevron from '../../elements/Chevron/Chevron'
import Flex from '../../elements/Flex/Flex'
import Link from '../../elements/Link/Link'

// const range = n => [...Array(n).keys()]

// const MAX_PAGES = 10

// const getPages = (currentPage, totalPages) => {
//   let first = currentPage - MAX_PAGES / 2
//   let last = currentPage + MAX_PAGES / 2

//   if (first < 1) {
//     last = last + (1 - first)
//     first = 1
//   }
//   if (last > totalPages) {
//     first = first - (last - totalPages)
//     last = totalPages
//   }
//   if (first < 1) {
//     first = 1
//   }

//   return range(last + 1 - first).map(page => page + first)
// }

// const Input = ({ currentPage }) => {
//   const [page, setPage] = React.useState(currentPage)

//   return (
//     <form
//       onSubmit={event => {
//         event.preventDefault()
//       }}
//     >
//       <input
//         // disabled={(currentPage || 1) < 2}
//         css={css({
//           bg: 'transparent',
//           border: 'none',
//           borderBottomColor: 'muted',
//           borderBottomStyle: 'solid',
//           borderTopColor: 'transparent',
//           borderTopStyle: 'solid',
//           borderWidth: 1,
//           color: 'primary',
//           mx: 4,
//           px: 1,
//           textAlign: 'right',
//           width: '3em',
//           '&::placeholder': {
//             color: 'grey.600',
//           },
//           '&[disabled]': {
//             pointerEvents: 'none',
//           },
//           '&:hover': {
//             borderBottomColor: 'primary',
//             borderWidth: 2,
//             color: 'primary',
//           },
//           '&:focus': {
//             borderBottomColor: 'muted',
//             borderWidth: 2,
//             color: 'text',
//           },
//         })}
//         placeholder={currentPage}
//         value={page}
//       />
//       )
//     </form>
//   )
// }

const Pagination = ({ currentPage, onPageChange, totalPages, ...props }) => (
  <Box as="nav" {...props}>
    <Flex css={css({ listStyle: 'none', m: 0, p: 0 })} as="ol">
      <li>
        <Link
          as="button"
          css={css({ alignItems: 'center', display: 'inline-flex', mr: 2 })}
          rel="prev"
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
          rel="next"
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
