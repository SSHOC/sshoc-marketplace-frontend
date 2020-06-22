import css from '@styled-system/css'
import React, { Fragment } from 'react'
import 'styled-components/macro'
import Dropdown from '../../elements/Dropdown/Dropdown'
import Heading from '../../elements/Heading/Heading'
import Icon from '../../elements/Icon/Icon'
import Link from '../../elements/Link/Link'
import Stack from '../../elements/Stack/Stack'

const ItemSidebar = ({ resource }) => {
  if (!resource) return null

  const properties = resource.properties.reduce((acc, property) => {
    const { code, label } = property.type
    const value = property.value ?? property.concept?.label

    const { values = [] } = acc[code] || {}

    acc[code] = {
      label,
      values: value != null ? [...values, value] : values,
    }
    return acc
  }, {})

  const [type] = properties['object-type'].values

  const links = [
    {
      label: (
        <>
          Go to {type || 'Resource'}{' '}
          <Icon
            css={css({
              alignSelf: 'flex-start',
              ml: '0.25em',
              p: '1px',
            })}
            icon="link"
            width="0.6em"
          />
        </>
      ),
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
      <Dropdown
        aria-label="Versions"
        links={links}
        size="large"
        // TODO: This whole ui element is a bit weird, since
        // `accessibleAt` can be empty, in which case we want to
        // disable the button, but we might still get older/newerVersions
        // for which we need the dropdown
        variant={resource.accessibleAt ? 'primary' : undefined}
      />
      <Heading as="h2" css={css({ mt: 6 })} variant="h4">
        Details
      </Heading>

      <Stack
        as="ul"
        css={css({ lineHeight: 'large', my: 3, overflowWrap: 'anywhere' })}
      >
        {Object.keys(properties)
          .sort()
          .map(code => {
            const property = properties[code]

            // FIXME: See sshoc-marketplace#40
            const values = property.values
              .filter(Boolean)
              .sort()
              .map((value, i, values) => {
                const element = /^https?:\/\//.test(value) ? (
                  <Link to={value}>{value}</Link>
                ) : (
                  <span>{value}</span>
                )
                return (
                  <Fragment key={value}>
                    {element}
                    {i === values.length - 1 ? null : ', '}
                  </Fragment>
                )
              })

            return (
              <li css={css({ fontSize: 1 })} key={code}>
                <span css={css({ color: 'muted', mr: 2 })}>
                  {property.label}:
                </span>
                {values}
              </li>
            )
          })}
      </Stack>
    </>
  )
}

export default ItemSidebar
