import css from '@styled-system/css'
import React from 'react'
import styled from 'styled-components/macro'
import Badge from '../../elements/Badge/Badge'
import Box from '../../elements/Box/Box'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Icon from '../../elements/Icon/Icon'
import Link from '../../elements/Link/Link'
import Placeholder from '../../elements/Placeholder/Placeholder'
import Text from '../../elements/Text/Text'
import PlainText from '../PlainText/PainText'

const MAX_DESCRIPTION_LENGTH = 400

const SearchResultContainer = styled(Flex)(
  css({
    bg: 'subtler',
    color: 'muted',
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
  })
)

export const SearchResultPlaceholder = () => (
  <SearchResultContainer>
    <Box css={{ flexBasis: 80, flexGrow: 0, flexShrink: 0 }}>
      <Placeholder.Icon />
    </Box>
    <Box css={{ flex: 1 }}>
      <Placeholder.Heading />
      <Placeholder.Text />
    </Box>
  </SearchResultContainer>
)

const SearchResult = ({ result }) => (
  <SearchResultContainer>
    <Box css={{ flexBasis: 80, flexGrow: 0, flexShrink: 0 }}>
      <Icon icon={result.category} width="3em" height="3em" />
    </Box>
    <Box css={{ flex: 1 }}>
      <Flex
        css={css({
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 2,
        })}
      >
        <Box css={css({ flex: 1, mr: 2 })}>
          <Link to={`/${result.category}s/${result.id}`}>
            <Heading as="h3" css={{ display: 'inline-block' }} variant="h4">
              {result.label}
            </Heading>
          </Link>
        </Box>
        <Badge>
          {
            result.properties.find(
              property => property.type.code === 'object-type'
            ).concept.label
          }
        </Badge>
      </Flex>
      <Box css={css({ my: 2 })}>
        <Text css={css({ color: 'grey.900' })} size="small">
          <span css={css({ color: 'grey.800' })}>Contributors: </span>
          {(result.contributors || [])
            .map(contributor => contributor.actor.name)
            .join(', ')}
        </Text>
        <Text css={css({ color: 'grey.400' })} size="small">
          <span>More Metadata: </span>
          What goes here?
        </Text>
      </Box>
      <Text css={css({ fontSize: 1, lineHeight: 'large', my: 3 })}>
        <PlainText maxLength={MAX_DESCRIPTION_LENGTH}>
          {result.description}
        </PlainText>
      </Text>
      <Flex css={css({ justifyContent: 'flex-end' })}>
        <Link to={`/${result.category}s/${result.id}`}>Read more</Link>
      </Flex>
    </Box>
  </SearchResultContainer>
)

export default SearchResult
