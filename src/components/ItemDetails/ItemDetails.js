import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Box from '../../elements/Box/Box'
import Centered from '../../elements/Centered/Centered'
import Flex from '../../elements/Flex/Flex'
import Heading from '../../elements/Heading/Heading'
import Icon from '../../elements/Icon/Icon'
import Spinner from '../../elements/Spinner/Spinner'
import Text from '../../elements/Text/Text'
import { REQUEST_STATUS } from '../../store/constants'

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
              <Text css={css({ color: 'grey.900' })} variant="small">
                <span css={css({ color: 'grey.800' })}>Contributors: </span>
                {(resource.contributors || [])
                  .map(contributor => contributor.actor.name)
                  .join(', ')}
              </Text>
              <Text css={css({ color: 'grey.400' })} variant="small">
                <span>More Metadata: </span>
                What goes here?
              </Text>
            </Box>
          </Box>
        </Flex>
        <Box css={css({ mt: 6 })}>
          <Heading as="h2" css={css({ my: 3 })} variant="h4">
            Description
          </Heading>
          <Text css={css({ lineHeight: 'large' })}>{resource.description}</Text>
        </Box>
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
        <Text>Oh no! {request.error ? request.error.message : null}</Text>
      </Centered>
    )
  }

  if (request.status === REQUEST_STATUS.SUCCEEDED) {
    return (
      <Centered>
        <Text>Not found</Text>
      </Centered>
    )
  }

  return null
}

export default ItemDetails
