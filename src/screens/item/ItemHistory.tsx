import Link from 'next/link'
import { Fragment } from 'react'

import type {
  DatasetDto,
  PublicationDto,
  ToolDto,
  TrainingMaterialDto,
  WorkflowDto,
} from '@/api/sshoc'

export interface ItemHistoryProps {
  item:
    | DatasetDto
    | PublicationDto
    | ToolDto
    | TrainingMaterialDto
    | WorkflowDto
}

export function ItemHistory(props: ItemHistoryProps): JSX.Element {
  return (
    <div>
      {props.item.newerVersions != null &&
      props.item.newerVersions.length > 0 ? (
        <Fragment>
          <h2 className="sr-only">Newer versions</h2>
          <ul className="flex flex-col space-y-2">
            {props.item.newerVersions.map((version) => (
              <ItemVersion key={version.id} version={version} />
            ))}
          </ul>
        </Fragment>
      ) : null}
      <div className="my-2">
        <h2 className="sr-only">Current version</h2>
        <ItemVersion version={props.item} />
      </div>
      {props.item.olderVersions != null &&
      props.item.olderVersions.length > 0 ? (
        <Fragment>
          <h2 className="sr-only">Older versions</h2>
          <ul className="flex flex-col space-y-2">
            {props.item.olderVersions.map((version) => (
              <ItemVersion key={version.id} version={version} />
            ))}
          </ul>
        </Fragment>
      ) : null}
    </div>
  )
}

interface ItemVersionProps {
  version:
    | Exclude<ItemHistoryProps['item']['newerVersions'], undefined>[number]
    | Exclude<ItemHistoryProps['item']['olderVersions'], undefined>[number]
}

/**
 * TODO: which versions is a user is allowed to see?
 * i.e. which requests for an item version will not error?
 */
function ItemVersion(props: ItemVersionProps) {
  const { version } = props

  return (
    <article className="px-4 py-4 border border-gray-200 rounded bg-gray-75">
      <Link
        href={{
          pathname: [
            '',
            version.category,
            version.persistentId,
            'version',
            version.id,
          ].join('/'),
        }}
      >
        <a>
          <h3 className="font-bold text-primary-750">
            {version.label}
            {version.version != null ? ` ${`${version.version}`}` : null}
          </h3>
        </a>
      </Link>
    </article>
  )
}
