import css from '@styled-system/css'
import React, { Fragment, useState } from 'react'
import 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Centered from '../../elements/Centered/Centered'
import Chevron from '../../elements/Chevron/Chevron'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
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
    case 'workflow':
      // return <pre>{JSON.stringify(resource, null, 2)}</pre>
      return null
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

const ImageCarousel = ({ images }) => {
  const [selected, setSelected] = useState(0)

  if (!images) return null

  const urls = images.map(image => image.value)

  return (
    <div css={css({ my: 6 })}>
      <div
        css={css({
          height: 480,
          border: '1px solid #ddd',
        })}
      >
        <div
          css={css({
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <img
            src={urls[selected]}
            alt=""
            css={css({ objectFit: 'contain', maxHeight: '100%', p: 4 })}
          />
        </div>
      </div>
      <div
        css={css({
          display: 'flex',
          justifyContent: 'space-between',
          border: '1px solid #ddd',
          borderTop: 0,
        })}
      >
        <button
          css={css({
            p: 3,
            background: 'none',
            border: 0,
            appearance: 'none',
            cursor: 'pointer',
            outline: 'none',
          })}
          onClick={() => {
            setSelected(selected => (selected + 1) % images.length)
          }}
        >
          <Chevron aria-label="Previous" direction="left" />
        </button>
        <div css={css({ display: 'flex' })}>
          {urls.map((src, i) => (
            <img
              key={i}
              css={css({
                height: 60,
                objectFit: 'cover',
                mx: 1,
                borderLeft: '1px solid #ddd',
                borderRight: '1px solid #ddd',
              })}
              alt=""
              src={src}
            />
          ))}
        </div>
        <button
          css={css({
            p: 3,
            background: 'none',
            border: 0,
            appearance: 'none',
            cursor: 'pointer',
            outline: 'none',
          })}
          onClick={() => {
            setSelected(selected => (selected + 1) % images.length)
          }}
        >
          <Chevron aria-label="Next" direction="right" />
        </button>
      </div>
    </div>
  )
}

const ItemDetails = ({ request, resource, itemCategories }) => {
  if (resource) {
    const thumbnail = resource.properties.find(
      property => property.type.code === 'thumbnail'
    )?.value

    return (
      <>
        <Flex>
          <Box css={{ flexBasis: 100, flexGrow: 0, flexShrink: 0 }}>
            <img
              src={thumbnail}
              style={{ objectFit: 'cover', width: '100%' }}
              alt=""
            />
          </Box>
          <Box css={css({ ml: 3 })}>
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
        <ImageCarousel
          images={resource.properties.filter(
            property => property.type.code === 'media'
          )}
        />
        <ResourceSpecificDetails resource={resource} />
        <RelatedItems
          items={resource.relatedItems}
          itemCategories={itemCategories}
        />
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
