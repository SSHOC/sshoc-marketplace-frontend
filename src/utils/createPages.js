import { range } from './range'

const ellipsis = 1

const isSimplePagination = ({ boundaryPages, siblingPages, totalPages }) =>
  1 + boundaryPages * 2 + siblingPages * 2 + ellipsis * 2 >= totalPages

const createFirstEllipsis = (firstPagesEnd, innerPagesStart) => {
  const page = innerPagesStart - 1
  const showEllipsis = page !== firstPagesEnd + 1
  return showEllipsis ? 0 : page
}

const createSecondEllipsis = (innerPagesEnd, lastPagesStart) => {
  const page = innerPagesEnd + 1
  const showEllipsis = page !== lastPagesStart - 1
  return showEllipsis ? 0 : page
}

const createPageRange = ({
  currentPage,
  boundaryPages,
  siblingPages,
  totalPages,
}) => {
  const firstPagesEnd = boundaryPages
  const firstPages = range(boundaryPages, 1)

  const lastPagesStart = totalPages + 1 - boundaryPages
  const lastPages = range(boundaryPages, lastPagesStart)

  const innerPagesStart = Math.min(
    Math.max(currentPage - siblingPages, firstPagesEnd + ellipsis + 1),
    lastPagesStart - ellipsis - 2 * siblingPages - 1
  )
  const innerPagesEnd = innerPagesStart + 2 * siblingPages
  const innerPages = range(2 * siblingPages + 1, innerPagesStart)

  return [
    ...firstPages,
    createFirstEllipsis(firstPagesEnd, innerPagesStart),
    ...innerPages,
    createSecondEllipsis(innerPagesEnd, lastPagesStart),
    ...lastPages,
  ]
}

export const createPages = ({
  boundaryPages = 2,
  currentPage,
  siblingPages = 2,
  totalPages,
}) =>
  isSimplePagination({ boundaryPages, siblingPages, totalPages })
    ? range(totalPages, 1)
    : createPageRange({
        boundaryPages,
        currentPage,
        siblingPages,
        totalPages,
      })
