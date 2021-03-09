import { JsonLd } from '@stefanprobst/next-page-metadata'
import { Fragment } from 'react'
import type { DeepRequired } from 'utility-types'

import type { ToolDto } from '@/api/sshoc'
import { useGetTool } from '@/api/sshoc'
import type { PageProps } from '@/pages/tool-or-service/[id]/index'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * Tool or service screen.
 */
export default function ToolScreen({
  tool: initialData,
}: PageProps): JSX.Element {
  /**
   * populate client cache with data from getServerSideProps,
   * to allow background refreshing
   */
  const { data } = useGetTool(
    { id: initialData.persistentId! },
    {},
    { enabled: initialData.persistentId !== undefined, initialData },
  )
  /** backend does not specify required fields. should be safe here */
  const tool = (data ?? initialData) as DeepRequired<ToolDto>

  return (
    <Fragment>
      {tool !== undefined ? (
        <JsonLd
          schema={{
            '@type': 'SoftwareApplication',
            headline: tool.label,
            name: tool.label,
            abstract: tool.description,
            description: tool.description,
            url: tool.accessibleAt,
            about: tool.properties
              .filter((property) => property.type.code === 'keyword')
              .map((property) => property.value),
            license: tool.licenses.map((license) => license.label),
            version: tool.version,
            contributor: tool.contributors.map(
              (contributor) => contributor.actor.name,
            ),
            inLanguage: tool.properties
              .filter((property) => property.type.code === 'language')
              .map((property) => property.concept.label),
          }}
        />
      ) : null}
      <ItemLayout item={tool} />
    </Fragment>
  )
}
