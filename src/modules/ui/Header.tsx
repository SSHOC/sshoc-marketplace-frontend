import Image from 'next/image'
import type { PropsWithChildren } from 'react'
import { Fragment } from 'react'
import ContentColumn from '@/modules/layout/ContentColumn'
import VStack from '@/modules/layout/VStack'
import ItemSearchForm, {
  ItemAutoCompleteInput,
  SubmitButton,
} from '@/modules/search/ItemSearchForm'

/**
 * Shared header with top search bar.
 */
export default function Header({
  image,
  children,
  initialValue,
}: PropsWithChildren<{ image?: string; initialValue?: string }>): JSX.Element {
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
            className="-z-10 object-top object-cover"
          />
        ) : null}
        <VStack className="space-y-6 p-6 relative">
          <ItemSearchForm className="rounded space-x-2 p-1 my-4 self-end max-w-screen-md w-full border border-gray-200">
            <ItemAutoCompleteInput
              className="border-none"
              initialValue={initialValue}
            />
            <SubmitButton className="h-10" />
          </ItemSearchForm>
          {children}
        </VStack>
      </ContentColumn>
    </Fragment>
  )
}
