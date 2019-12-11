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
import { truncate } from '../../utils'

const MAX_DESCRIPTION_LENGTH = 200

// TODO: pretty much duplicated from <SearchResult />
const RelatedItem = ({ item }) => (
  <Flex
    css={css({
      bg: 'subtler',
      mb: 1,
      p: 4,
    })}
  >
    <Box css={{ flexBasis: 80, flexGrow: 0, flexShrink: 0 }}>
      <Icon icon={item.category} width="3em" height="3em" />
    </Box>
    <Box css={{ flex: 1 }}>
      <Flex
        css={css({
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 2,
        })}
      >
        <Link
          css={css({ flex: 1, mr: 2 })}
          to={`/${item.category}s/${item.id}`}
        >
          <Heading as="h3" variant="h4">
            {item.label}
          </Heading>
        </Link>
        <Badge>{ITEM_CATEGORY[item.category]}</Badge>
      </Flex>

      <Box css={css({ my: 2 })}>
        <Text css={css({ color: 'grey.900' })} variant="small">
          <span css={css({ color: 'grey.800' })}>Contributors: </span>
          {(item.contributors || [])
            .map(contributor => contributor.actor.name)
            .join(', ')}
        </Text>
        <Text css={css({ color: 'grey.400' })} variant="small">
          <span>More Metadata: </span>
          What goes here?
        </Text>
      </Box>

      <Text css={css({ fontSize: 1, lineHeight: 'large', my: 3 })}>
        {truncate(item.description, { length: MAX_DESCRIPTION_LENGTH })}
      </Text>
    </Box>
  </Flex>
)

export default RelatedItem
