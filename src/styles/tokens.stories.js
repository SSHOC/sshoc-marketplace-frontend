import css from '@styled-system/css'
import 'styled-components/macro'
import React from 'react'
import Box from '../elements/Box/Box'
import FlexList from '../elements/FlexList/FlexList'
import Stack from '../elements/Stack/Stack'
import Text from '../elements/Text/Text'

export default {
  title: 'Tokens|Colors',
}

export const palette = () => (
  <FlexList>
    <li>
      <Stack css={css({ alignItems: 'center', mx: 2 })}>
        <Text size="small">primary</Text>
        <Box css={css({ width: 50, height: 50, bg: 'primary', my: 1 })} />
        <Box css={css({ width: 50, height: 50, bg: 'primaryActive', my: 1 })} />
        <Box css={css({ width: 50, height: 50, bg: 'primaryHover', my: 1 })} />
      </Stack>
    </li>
    <li>
      <Stack css={css({ alignItems: 'center', mx: 2 })}>
        <Text size="small">grey</Text>
        <Box css={css({ width: 50, height: 50, bg: 'black', my: 1 })} />
        <Box css={css({ width: 50, height: 50, bg: 'muted', my: 1 })} />
        <Box css={css({ width: 50, height: 50, bg: 'border', my: 1 })} />
        <Box css={css({ width: 50, height: 50, bg: 'subtle', my: 1 })} />
        <Box css={css({ width: 50, height: 50, bg: 'subtler', my: 1 })} />
        <Box css={css({ width: 50, height: 50, bg: 'subtleest', my: 1 })} />
      </Stack>
    </li>
  </FlexList>
)
