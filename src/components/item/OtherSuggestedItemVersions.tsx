import Link from 'next/link'

import {
  useGetDatasetHistory,
  useGetPublicationHistory,
  useGetToolHistory,
  useGetTrainingMaterialHistory,
  useGetWorkflowHistory,
} from '@/api/sshoc'
import type { ItemCategory } from '@/api/sshoc/types'
import { useAuth } from '@/modules/auth/AuthContext'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'

const useItemHistory = {
  dataset: useGetDatasetHistory,
  publication: useGetPublicationHistory,
  'tool-or-service': useGetToolHistory,
  'training-material': useGetTrainingMaterialHistory,
  workflow: useGetWorkflowHistory,
}

export function OtherSuggestedItemVersions({
  category,
  persistentId,
  versionId,
}: {
  category: Exclude<ItemCategory, 'step'>
  persistentId: string
  versionId: number
}): JSX.Element | null {
  const auth = useAuth()
  const history = useItemHistory[category](
    { persistentId },
    { approved: false },
    { enabled: auth.session?.accessToken != null },
    { token: auth.session?.accessToken },
  )

  if (history.data == null) return null

  const unapprovedItemVersions = history.data.filter(
    (item) =>
      ['suggested', 'ingested'].includes(item.status!) && item.id !== versionId,
  )

  if (unapprovedItemVersions.length === 0) return null

  return (
    <FormSection title="Other suggested changes">
      <p>
        There are {unapprovedItemVersions.length} other suggested changes to
        this item. Note that approving one will automatically reject all other
        suggestions.
      </p>
      <ul className="flex flex-col space-y-2 text-sm">
        {unapprovedItemVersions.map((item) => {
          return (
            <li key={item.version}>
              <article>
                <h3>
                  <Link
                    href={{
                      pathname: `/${item.category}/${item.persistentId}/version/${item.id}/edit`,
                      query: { review: true },
                    }}
                  >
                    <a className="transition text-primary-750 hover:text-secondary-600">
                      {item.label}
                    </a>
                  </Link>
                </h3>
                <small className="text-gray-550">
                  Suggested by {item.informationContributor?.displayName} on{' '}
                  <time dateTime={item.lastInfoUpdate}>
                    {item.lastInfoUpdate}
                  </time>
                  .
                </small>
              </article>
            </li>
          )
        })}
      </ul>
    </FormSection>
  )
}
