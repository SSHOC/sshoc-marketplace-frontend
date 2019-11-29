import css from '@styled-system/css'
import React, { forwardRef } from 'react'
import 'styled-components/macro'
import FlexList from '../FlexList/FlexList'
import Link from '../Link/Link'

const Breadcrumnbs = forwardRef(
  ({ delimiter = '/', paths = [], ...props }, ref) => (
    <nav ref={ref} aria-label="Breadcrumbs" css={css({ my: 4 })} {...props}>
      <FlexList as="ol">
        {paths.slice(0, -1).map(({ label, value }) => (
          <li css={css({ fontSize: 1 })} key={value}>
            <Link to={value}>{label}</Link>
            <span
              css={css({
                mx: 2,
              })}
            >
              {delimiter}
            </span>
          </li>
        ))}
        {paths.slice(-1).map(({ label }) => (
          <li css={css({ color: 'muted', fontSize: 1 })} key={label}>
            {label}
          </li>
        ))}
      </FlexList>
    </nav>
  )
)

export default Breadcrumnbs
