import cx from 'clsx'
import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { Button } from '@/elements/Button/Button'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'
import styles from '@/screens/item/ItemSubmitSuccessScreen.module.css'

export default function ItemSubmitSuccessScreen(): JSX.Element {
  const router = useRouter()

  return (
    <Fragment>
      <Metadata title="Success" nofollow noindex />
      <GridLayout className={styles.layout}>
        <ContentColumn className={cx('xs:px-6 px-2', styles.content)}>
          <div className="relative max-w-1.5xl px-4 xs:px-8 md:px-16 py-8 xs:py-16 mx-auto lg:mx-0 my-6 xs:my-12 space-y-8 bg-white rounded-md shadow-md">
            <Title className="font-bold">Successfully submitted!</Title>
            <hr />
            <p>
              Thanks! Your changes have been successfully submitted and sent to a moderator for
              review. After approval, the changes will be visible on the SSHOC Marketplace.
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
          /* Note that we cannot use "transparent" here for the second value, because Safari interprets that as rgba(0, 0, 0, 0), which will produce an awful transition to gray. */
          background: linear-gradient(41deg, #e7f5ff, #e7f5ff00 85%);
        }
      `}</style>
    </Fragment>
  )
}
