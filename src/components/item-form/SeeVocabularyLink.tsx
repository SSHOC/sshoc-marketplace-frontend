/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Fragment } from 'react'

import { Link } from '@/components/common/Link'
import type { StaticResult as PropertyTypes } from '@/components/item-form/property-types.static'
import _propertyTypes from '@/components/item-form/property-types.static'

const propertyTypes = _propertyTypes as unknown as PropertyTypes

export function SeeVocabularyLink({ type }: { type: string }): JSX.Element | null {
  return (
    <Fragment>
      {propertyTypes[type]!.allowedVocabularies.map((vocabulary, index) => {
        const href = vocabulary.accessibleAt ?? vocabulary.namespace

        if (href == null) return null

        return (
          <Fragment key={vocabulary.code}>
            {index !== 0 ? ', ' : null}
            <Link href={{ pathname: href }} target="_blank" rel="noreferrer">
              {vocabulary.label}
            </Link>
          </Fragment>
        )
      })}
    </Fragment>
  )
}
