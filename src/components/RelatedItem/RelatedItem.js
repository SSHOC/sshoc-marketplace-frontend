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
import PlainText from '../PlainText/PainText'

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
      {/* NOTE: we cannot use a thumbnail here, because related items don't include properties */}
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
        {/* FIXME: We don't get additional metadata for related items */}
        {/* <Badge>
          {
            item.properties.find(
              property => property.type.code === 'object-type'
            ).concept.label
          }
        </Badge> */}
        <Badge>{ITEM_CATEGORY[item.category]}</Badge>
      </Flex>

      <Box css={css({ my: 2 })}>
        <Text css={css({ color: 'grey.900' })} size="small">
          <span css={css({ color: 'grey.800' })}>Contributors: </span>
          {(item.contributors || [])
            .map(contributor => contributor.actor.name)
            .join(', ')}
        </Text>
        {/* FIXME: We don't get additional metadata for related items */}
        {/* <Text css={css({ color: 'grey.900' })} size="small">
          <span css={css({ color: 'grey.800' })}>Activities: </span>
          {item.properties
            .filter(property => property.type.code === 'activity')
            .map(property => property.concept?.label ?? property.value)
            .join(', ')}
        </Text> */}
      </Box>

      <Text css={css({ fontSize: 1, lineHeight: 'large', my: 3 })}>
        <PlainText maxLength={MAX_DESCRIPTION_LENGTH}>
          {item.description}
        </PlainText>
      </Text>
    </Box>
  </Flex>
)

export default RelatedItem
