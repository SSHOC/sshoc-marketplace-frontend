import css from '@styled-system/css'
import React, { Fragment } from 'react'
import 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Centered from '../../elements/Centered/Centered'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Icon from '../../elements/Icon/Icon'
import Link from '../../elements/Link/Link'
import Spinner from '../../elements/Spinner/Spinner'
import Text from '../../elements/Text/Text'
import { REQUEST_STATUS } from '../../store/constants'
import { formatDate } from '../../utils'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import Markdown from '../Markdown/Markdown'
import RelatedItems from '../RelatedItems/RelatedItems'

const ItemContributors = ({ contributors }) => {
  if (!contributors || !contributors.length) {
    return null
  }

  return (
    <Text css={css({ color: 'grey.900' })} size="small">
      <span css={css({ color: 'grey.800' })}>Contributors: </span>
      {contributors.map((contributor, i) => (
        <Fragment key={contributor.actor.id}>
          {contributor.actor.website ? (
            <span>
              <Link css={css({ color: 'text' })} to={contributor.actor.website}>
                {contributor.actor.name}
              </Link>
            </span>
          ) : (
            <span>{contributor.actor.name}</span>
          )}
          {contributor.actor.email ? (
            <>
              {' '}
              <span>
                (
                <Link
                  css={css({ color: 'text' })}
                  to={`mailto:${contributor.actor.email}`}
                >
                  {contributor.actor.email}
                </Link>
                )
              </span>
            </>
          ) : null}
          {i === contributors.length - 1 ? null : ', '}
        </Fragment>
      ))}
    </Text>
  )
}

const ResourceSpecificDetails = ({ resource }) => {
  switch (resource.category) {
    case 'activity':
      return (
        <pre>
          {JSON.stringify(resource.composedOf.map(c => c.label), null, 2)}
        </pre>
      )
    case 'dataset':
      return null
    case 'tool':
      return null
    case 'training-material':
      return null
    default:
      return null
  }
}

const ItemDetails = ({ request, resource }) => {
  if (resource) {
    return (
      <>
        <Flex>
          <Box css={{ flexBasis: 100, flexGrow: 0, flexShrink: 0 }}>
            <Icon icon={resource.category} width="5em" height="5em" />
          </Box>
          <Box>
            <Heading as="h1" css={css({ mb: 4 })} variant="h2">
              {resource.label}{' '}
              <span css={css({ fontSize: 4, ml: 2 })}>
                {resource.version != null ? `(${resource.version})` : null}
              </span>
            </Heading>
            <Box>
              <ItemContributors contributors={resource.contributors} />
              <Text css={css({ color: 'grey.900' })} size="small">
                <span css={css({ color: 'grey.800' })}>Activities: </span>
                {resource.properties
                  .filter(property => property.type.code === 'activity')
                  .map(property => property.concept?.label ?? property.value)
                  .join(', ')}
              </Text>
              <Text css={css({ color: 'grey.800' })} size="small">
                {resource.lastInfoUpdate ? (
                  <span>
                    Last modified on {formatDate(resource.lastInfoUpdate)}
                  </span>
                ) : null}
              </Text>
            </Box>
          </Box>
        </Flex>
        <Box css={css({ my: 6 })}>
          <Heading as="h2" css={css({ my: 3 })} variant="h4">
            Description
          </Heading>
          <Text css={css({ lineHeight: 'large' })}>
            <Markdown>{resource.description}</Markdown>
          </Text>
        </Box>
        <RelatedItems items={resource.relatedItems} />
        <ResourceSpecificDetails resource={resource} />
      </>
    )
  }

  if (request.status === REQUEST_STATUS.PENDING) {
    return (
      <Centered css={css({ color: 'primary' })}>
        <Spinner aria-label="Loading" delayed height="6em" width="6em" />
      </Centered>
    )
  }

  if (request.status === REQUEST_STATUS.FAILED) {
    return (
      <Centered>
        <ErrorMessage level="error">{request.error?.message}</ErrorMessage>
      </Centered>
    )
  }

  if (request.status === REQUEST_STATUS.SUCCEEDED) {
    return (
      <Centered>
        <ErrorMessage level="info">Not found</ErrorMessage>
      </Centered>
    )
  }

  return null
}

export default ItemDetails
