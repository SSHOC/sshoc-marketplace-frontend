import css from '@styled-system/css'
import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components/macro'
import Badge from '../../elements/Badge/Badge'
import Box from '../../elements/Box/Box'
import Divider from '../../elements/Divider/Divider'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Spinner from '../../elements/Spinner/Spinner'
import Stack from '../../elements/Stack/Stack'
import Text from '../../elements/Text/Text'
import { fetchSearchResults } from '../../store/actions/items'
import { REQUEST_STATUS } from '../../store/constants'
import { selectors } from '../../store/reducers'
import { pluralize } from '../../utils'

const MAX_BROWSE_LINKS = 20
const MAX_LAST_ADDED = 5

const defaultSearchParams = {
  categories: [],
  facets: {},
  page: 1,
  query: null,
  sort: 'modified-on',
}

const BrowseContainer = () => {
  const dispatch = useDispatch()

  const request = useSelector(state =>
    selectors.requests.selectRequestByName(state, {
      name: fetchSearchResults,
      query: defaultSearchParams,
    })
  )

  const items = useSelector(state =>
    selectors.items.selectResources(state, request.resources.items)
  )

  // to get all used activity types and keywords, there is no other way
  // but with an empty search, and then take the facet info
  // in this case that's actually ok, since we need to fetch the "last added"
  // items anyway
  useEffect(() => {
    dispatch(fetchSearchResults(defaultSearchParams))
  }, [dispatch])

  const facets = request.info?.facets || {}

  const activityTypes = facets['activity'] || {}
  const keywords = facets['keyword'] || {}
  const objectTypes = facets['object-type'] || {}

  const isLoading =
    !items &&
    [REQUEST_STATUS.IDLE, REQUEST_STATUS.PENDING].includes(request.status)

  if (request.status === REQUEST_STATUS.FAILED) {
    return null
  }

  return (
    <Browse
      activityTypes={activityTypes}
      isLoading={isLoading}
      items={items}
      keywords={keywords}
      objectTypes={objectTypes}
    />
  )
}

export const Browse = ({
  activityTypes,
  isLoading,
  items,
  keywords,
  objectTypes,
}) => (
  <Flex>
    <div css={{ flex: 1 }}>
      <SectionHeading>Browse</SectionHeading>
      <BrowseActivityTypes
        activityTypes={activityTypes}
        isLoading={isLoading}
      />
      <BrowseKeywords keywords={keywords} isLoading={isLoading} />
      <BrowseObjectTypes objectTypes={objectTypes} isLoading={isLoading} />
    </div>
    <SidePanel>
      <SectionHeading>Last added</SectionHeading>
      <LastAdded items={items} isLoading={isLoading} />
    </SidePanel>
  </Flex>
)

const Section = styled('section')(
  css({
    my: 6,
  })
)

const SidePanel = styled('aside')(
  css({
    bg: 'subtlest',
    flexBasis: 480,
    flexGrow: 0,
    p: 48,
    my: -48,
    ml: 48,
    position: 'relative',
    '&::after': {
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

const SectionHeading = styled(Heading).attrs({ as: 'h2' })(
  css({
    fontSize: 26,
  })
)

const BrowseSectionHeader = styled(Flex)({
  justifyContent: 'space-between',
})

const BrowseSectionHeading = styled(Heading).attrs({ as: 'h3' })(
  css({
    fontSize: 20,
    fontWeight: 500,
  })
)

const Line = styled(Divider)(
  css({
    my: 3,
  })
)

const List = styled('ul')(
  css({
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    my: 20,
    p: 0,
  })
)

const ListItem = styled('li')(
  css({
    mr: 30,
    lineHeight: 2.5,
  })
)

const Link = styled(RouterLink)(
  css({
    color: 'primary',
    fontFamily: 'heading',
    fontSize: 15,
    fontWeight: 400,
    textDecoration: 'none',
  })
)

const LoadingMessage = () => (
  <Flex
    css={css({
      color: 'primary',
      alignItems: 'center',
      justifyContent: 'center',
      p: 6,
    })}
  >
    <Spinner height="3em" width="3em" />
  </Flex>
)

const BrowseActivityTypes = ({ activityTypes, isLoading }) => (
  <Section>
    <BrowseSectionHeader>
      <BrowseSectionHeading>Browse by activity types</BrowseSectionHeading>
      <Link to="/browse/activity">See all</Link>
    </BrowseSectionHeader>
    <Line />
    {isLoading ? (
      <LoadingMessage />
    ) : (
      <List>
        {Object.entries(activityTypes)
          .slice(0, MAX_BROWSE_LINKS)
          .map(([activityType, { count }]) => (
            <ListItem key={activityType}>
              <Link
                to={`/search?facets=${JSON.stringify({
                  activity: [activityType],
                })}`}
              >
                {activityType} ({count})
              </Link>
            </ListItem>
          ))}
      </List>
    )}
  </Section>
)

const BrowseKeywords = ({ keywords, isLoading }) => (
  <Section>
    <BrowseSectionHeader>
      <BrowseSectionHeading>Browse by keywords</BrowseSectionHeading>
      <Link to="/browse/keyword">See all</Link>
    </BrowseSectionHeader>
    <Line />
    {isLoading ? (
      <LoadingMessage />
    ) : (
      <List>
        {Object.entries(keywords)
          .slice(0, MAX_BROWSE_LINKS)
          .map(([keyword, { count }]) => (
            <ListItem key={keyword}>
              <Link
                to={`/search?facets=${JSON.stringify({
                  keyword: [keyword],
                })}`}
              >
                {keyword} ({count})
              </Link>
            </ListItem>
          ))}
      </List>
    )}
  </Section>
)

const BrowseObjectTypes = ({ objectTypes, isLoading }) => (
  <Section>
    <BrowseSectionHeader>
      <BrowseSectionHeading>Browse by item types</BrowseSectionHeading>
      <Link to="/browse/object-type">See all</Link>
    </BrowseSectionHeader>
    <Line />
    {isLoading ? (
      <LoadingMessage />
    ) : (
      <List>
        {Object.entries(objectTypes)
          .slice(0, MAX_BROWSE_LINKS)
          .map(([objectType, { count }]) => (
            <ListItem key={objectType}>
              <Link
                to={`/search?facets=${JSON.stringify({
                  'object-type': [objectType],
                })}`}
              >
                {objectType} ({count})
              </Link>
            </ListItem>
          ))}
      </List>
    )}
  </Section>
)

const LastAdded = ({ items, isLoading }) => (
  <Section>
    <BrowseSectionHeader>
      <BrowseSectionHeading>See what's new</BrowseSectionHeading>
      <Link to="/search?sort=modified-on">See all</Link>
    </BrowseSectionHeader>
    <Line />
    {isLoading ? (
      <LoadingMessage />
    ) : (
      <List>
        {(items || []).slice(0, MAX_LAST_ADDED).map((item, i) => (
          <Fragment key={i}>
            <li>
              <Item item={item} />
              {i === items.length - 1 ? null : <Divider css={css({ my: 4 })} />}
            </li>
          </Fragment>
        ))}
      </List>
    )}
  </Section>
)

const Item = ({ item }) => {
  return (
    <Stack>
      <Flex css={{ justifyContent: 'flex-end' }}>
        <Badge css={css({ bg: 'none', mb: 3, fontSize: 1 })}>
          {item.category}
        </Badge>
      </Flex>
      <Heading
        as="h4"
        css={css({ fontSize: 17, fontWeight: 500, lineHeight: 1.25, my: 3 })}
      >
        {item.label}
      </Heading>
      <Box css={css({ fontSize: 1, lineHeight: 1.75 })}>
        <Text css={css({ color: 'grey.900' })} size="small">
          <span css={css({ color: 'grey.800' })}>Contributors: </span>
          {(item.contributors || [])
            .map(contributor => contributor.actor.name)
            .join(', ')}
        </Text>
        <Text css={css({ color: 'grey.900' })} size="small">
          <span css={css({ color: 'grey.800' })}>Activities: </span>
          {item.properties
            .filter(property => property.type.code === 'activity')
            .map(property => property.concept?.label ?? property.value)
            .join(', ')}
        </Text>
      </Box>
      <Text css={css({ fontSize: 15, lineHeight: 1.75, my: 3 })}>
        {item.description}
      </Text>
      <Flex css={css({ justifyContent: 'flex-end' })}>
        <Link
          css={css({ fontSize: 14 })}
          to={`/${pluralize(item.category)}/${item.id}`}
        >
          Read more
        </Link>
      </Flex>
    </Stack>
  )
}

export default BrowseContainer
