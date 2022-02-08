import { SchemaOrg } from '@stefanprobst/next-page-metadata'
import { Fragment } from 'react'
import type { DeepRequired } from 'utility-types'

import type { ToolDto } from '@/api/sshoc'
import { useGetTool } from '@/api/sshoc'
import { useAuth } from '@/modules/auth/AuthContext'
import type { PageProps } from '@/pages/tool-or-service/[id]/index.page'
import ItemLayout from '@/screens/item/ItemLayout'

/**
 * Tool or service screen.
 */
export default function ToolScreen({ tool: initialData }: PageProps): JSX.Element {
  /** token is used to get hidden properties */
  const auth = useAuth()

  /**
   * populate client cache with data from getServerSideProps,
   * to allow background refreshing
   */
  const { data } = useGetTool(
    { persistentId: initialData.persistentId! },
    {},
    { enabled: initialData.persistentId !== undefined, initialData },
    { token: auth.session?.accessToken },
  )
  /** backend does not specify required fields. should be safe here */
  const tool = (data ?? initialData) as DeepRequired<ToolDto>

  const license = tool.properties.find((property) => {
    return property.type.code === 'license'
  })?.concept.label

  return (
    <Fragment>
      {tool !== undefined ? (
        <SchemaOrg
          schema={{
            '@type': 'SoftwareApplication',
            headline: tool.label,
            name: tool.label,
            abstract: tool.description,
            description: tool.description,
            url: tool.accessibleAt,
            about: tool.properties
              .filter((property) => {
                return property.type.code === 'keyword'
              })
              .map((property) => {
                return property.value
              }),
            license,
            version: tool.version,
            contributor: tool.contributors.map((contributor) => {
              return contributor.actor.name
            }),
            inLanguage: tool.properties
              .filter((property) => {
                return property.type.code === 'language'
              })
              .map((property) => {
                return property.concept.label
              }),
          }}
        />
      ) : null}
      <ItemLayout item={tool} />
    </Fragment>
  )
}
