import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { useGetTool } from '@/api/sshoc'
import { convertToInitialFormValues } from '@/api/sshoc/helpers'
import { ItemForm } from '@/components/item/ToolEditForm/ToolEditForm'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Edit tool screen.
 */
export default function ToolEditScreen(): JSX.Element {
  const router = useRouter()

  const id = router.query.id as string | undefined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tool = useGetTool({ id: id! }, {}, { enabled: id != null })

  return (
    <Fragment>
      <Metadata noindex title="Edit tool" />
      <GridLayout style={{ alignContent: 'stretch ' }}>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>Edit tool</Title>
          {tool.data === undefined || id == undefined ? (
            <div className="flex flex-col items-center justify-center">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemForm
              id={id}
              category="tool-or-service"
              initialValues={convertToInitialFormValues(tool.data)}
              item={tool.data}
            />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
