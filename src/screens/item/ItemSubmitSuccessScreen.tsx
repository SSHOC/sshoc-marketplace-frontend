import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { Button } from '@/elements/Button/Button'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

export default function ItemSubmitSuccessScreen(): JSX.Element {
  const router = useRouter()

  return (
    <Fragment>
      <Metadata title="Success" nofollow noindex />
      <GridLayout style={{ gridTemplateRows: '1fr' }}>
        <ContentColumn style={{ gridColumn: '4 / span 6' }}>
          <div className="relative flex flex-col max-w-xl px-12 py-16 my-12 space-y-10 bg-white rounded-md shadow-md">
            <div>
              <Title className="font-bold">Successfully submitted!</Title>
              <p>A moderator has been notified (well, not yet, but soon)</p>
            </div>
            <hr />
            <p>
              Thanks! Your changes have been successfully submitted and sent to
              a moderator for review. After approval, the changes will be
              visible on the SSHOC Marketplace.
            </p>
            <hr />
            <div className="self-end">
              <Button
                onPress={() => {
                  router.push({ pathname: '/' })
                }}
                variant="gradient"
              >
                Back to homepage
              </Button>
            </div>
          </div>
        </ContentColumn>
      </GridLayout>
      <style jsx global>{`
        body {
          background: linear-gradient(41deg, #e7f5ff, transparent 85%);
        }
      `}</style>
    </Fragment>
  )
}
