import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Flex from '../Flex/Flex'
import Placeholder from './Placeholder'

export default {
  title: 'Elements|Placeholder',
}

export const searchResult = () => (
  <Flex
    css={css({
      bg: 'subtler',
      color: 'muted',
      mb: 1,
      p: 4,
    })}
  >
    <div style={{ flexBasis: 80, flexGrow: 0, flexShrink: 0 }}>
      <Placeholder.Icon />
    </div>
    <div style={{ flex: 1 }}>
      <Placeholder.Heading />
      <Placeholder.Text />
    </div>
  </Flex>
)
