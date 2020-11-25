import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import type { FormEvent } from 'react'
import { useQueryCache } from 'react-query'
import { useAuth } from '@/modules/auth/AuthContext'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import VStack from '@/modules/layout/VStack'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'
import { getRedirectPath } from '@/utils/getRedirectPath'
import { getScalarQueryParameter } from '@/utils/getScalarQueryParameter'

/**
 * Sign out screen.
 */
export default function SignOutScreen(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex nofollow title="Sign in" />
      <GridLayout style={{ gridTemplateRows: '1fr' }}>
        <ContentColumn style={{ gridColumn: '4 / -2' }}>
          <Image
            src={'/assets/images/auth/signout-reset/people@2x.png'}
            alt=""
            loading="lazy"
            layout="fill"
            quality={100}
            className="-z-10 object-cover object-right-bottom"
          />
          <VStack className="shadow-md rounded-md max-w-xl px-12 py-16 my-12 bg-white space-y-6 relative">
            <Title>Sign out</Title>
            <hr className="border-gray-200" />
            <SignOutForm />
          </VStack>
        </ContentColumn>
      </GridLayout>
      <style jsx global>{`
        body {
          background: linear-gradient(41deg, #e7f5ff, transparent);
        }
      `}</style>
    </Fragment>
  )
}

function SignOutForm() {
  const router = useRouter()
  const auth = useAuth()
  const queryCache = useQueryCache()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    auth.signOut()
    /** clear the whole query cache to be on the safe side */
    queryCache.clear()
    router.replace(
      getRedirectPath(getScalarQueryParameter(router.query.from)) ?? '/',
    )
  }

  return (
    <form onSubmit={onSubmit} className="self-end py-2">
      <button
        type="submit"
        className="py-3 px-6 w-40 rounded transition-colors duration-150 text-white bg-primary-800 hover:bg-primary-700"
      >
        Sign out
      </button>
    </form>
  )
}
