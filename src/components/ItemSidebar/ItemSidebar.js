import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import Dropdown from '../../elements/Dropdown/Dropdown'
import Heading from '../../elements/Heading/Heading'
import Stack from '../../elements/Stack/Stack'

const ItemSidebar = ({ resource }) => {
  if (!resource) return null

  const properties = resource.properties.reduce((acc, property) => {
    acc[property.type.code] = property
    return acc
  }, {})

  // FIXME: Shouldn't those be required fields?
  const type =
    properties['object-type'] &&
    properties['object-type'].concept &&
    properties['object-type'].concept.label

  const links = [
    {
      label: `Go to ${type || 'Resource'}`,
      path: resource.accessibleAt,
    },
    ...(resource.olderVersions || []).map(({ id, label, version }) => ({
      label: `${label} ${version}`,
      path: `/${resource.category}s/${id}`,
    })),
    ...(resource.newerVersions || []).map(({ id, label, version }) => ({
      label: `${label} ${version}`,
      path: `/${resource.category}s/${id}`,
    })),
  ]

  return (
    <>
      <Dropdown links={links} size="large" variant="primary" />
      <Heading as="h2" css={css({ mt: 6 })} variant="h4">
        Details
      </Heading>

      <Stack as="ul" css={css({ lineHeight: 'large', my: 3 })}>
        {Object.keys(properties)
          .sort()
          .map(code => {
            const property = properties[code]

            return (
              <li css={css({ fontSize: 1 })} key={code}>
                <span css={css({ color: 'muted', mr: 2 })}>
                  {property.type.label}:
                </span>
                {/* FIXME: Is this correct? i.e. we either have freeform value, or concept.label? */}
                {property.value ||
                  (property.concept && property.concept.label) ||
                  null}
              </li>
            )
          })}
      </Stack>
    </>
  )
}

export default ItemSidebar
