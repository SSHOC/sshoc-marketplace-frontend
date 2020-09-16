import css from '@styled-system/css'
import React, { Fragment } from 'react'
import 'styled-components/macro'
import Button from '../../elements/Button/Button'
import Heading from '../../elements/Heading/Heading'
import Icon from '../../elements/Icon/Icon'
import Link from '../../elements/Link/Link'
import Stack from '../../elements/Stack/Stack'

const ItemSidebar = ({ resource, itemCategories }) => {
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

  const type = itemCategories?.[resource.category] || 'Resource'
  const [url] = resource.accessibleAt || []

  return (
    <>
      {url ? (
        <Button
          as="a"
          href={url}
          size="large"
          variant="primary"
          css={css({ mb: 6 })}
        >
          Go to {type}{' '}
          <Icon
            css={css({
              alignSelf: 'flex-start',
              ml: '0.25em',
              p: '1px',
            })}
            icon="link"
            width="0.6em"
          />
        </Button>
      ) : null}
      <Heading as="h2" variant="h4">
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
