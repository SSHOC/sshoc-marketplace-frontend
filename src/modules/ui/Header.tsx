import Image from 'next/image'
import type { PropsWithChildren } from 'react'
import { Fragment } from 'react'

import ContentColumn from '@/modules/layout/ContentColumn'
import VStack from '@/modules/layout/VStack'
import ItemSearchForm, {
  ItemSearchComboBox,
  SubmitButton,
} from '@/modules/search/ItemSearchForm'

/**
 * Shared header with top search bar.
 */
export default function Header({
  image,
  children,
}: PropsWithChildren<{ image?: string }>): JSX.Element {
  return (
    <Fragment>
      <ContentColumn>
        {image !== undefined ? (
          <Image
            src={image}
            alt=""
            layout="fill"
            loading="lazy"
            quality={100}
            className="object-cover object-top -z-10"
          />
        ) : null}
        <VStack className="relative p-6 space-y-6">
          <ItemSearchForm className="flex items-center self-end w-full max-w-screen-md px-2 py-1 my-4 space-x-2 bg-white border border-gray-200 rounded">
            <ItemSearchComboBox variant="invisible" />
            <SubmitButton className="h-10" />
          </ItemSearchForm>
          {children}
        </VStack>
      </ContentColumn>
    </Fragment>
  )
}
