import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import { ITEM_CATEGORY } from '../../constants'
import Badge from '../../elements/Badge/Badge'
import Box from '../../elements/Box/Box'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Icon from '../../elements/Icon/Icon'
import Link from '../../elements/Link/Link'
import Text from '../../elements/Text/Text'

const SearchResult = ({ result }) => (
  <Flex
    css={css({
      bg: 'subtler',
      mb: 1,
      p: 4,
      position: 'relative',
      '&:after': {
        bg: 'inherit',
        content: '""',
        height: '100%',
        left: '100%',
        position: 'absolute',
        top: 0,
        width: '100vw',
      },
    })}
  >
    <Box css={{ flexBasis: 80, flexGrow: 0, flexShrink: 0 }}>
      <Icon icon={result.category} width="3em" height="3em" />
    </Box>
    <Box css={{ flex: 1 }}>
      <Flex
        css={css({
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        })}
      >
        <Link
          css={css({ flex: 1, mr: 2 })}
          to={`/${result.category}s/${result.id}`}
        >
          <Heading as="h3" variant="h4">
            {result.label}
          </Heading>
        </Link>
        <Badge>{ITEM_CATEGORY[result.category]}</Badge>
      </Flex>
      <Box css={css({ my: 2 })}>
        <Text css={css({ color: 'grey.900' })} variant="small">
          <span css={css({ color: 'grey.800' })}>Contributors: </span>
          {(result.contributors || [])
            .map(contributor => contributor.actor.name)
            .join(', ')}
        </Text>
        <Text css={css({ color: 'grey.400' })} variant="small">
          <span>More Metadata: </span>
          What goes here?
        </Text>
      </Box>
      <Text css={css({ fontSize: 1, lineHeight: 'large', my: 3 })}>
        {result.description}
      </Text>
      <Flex css={css({ justifyContent: 'flex-end' })}>
        <Link to={`/${result.category}s/${result.id}`}>Read more</Link>
      </Flex>
    </Box>
  </Flex>
)

export default SearchResult
