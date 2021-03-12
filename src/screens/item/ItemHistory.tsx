import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { useQueryClient } from 'react-query'

import type {
  DatasetDto,
  PublicationDto,
  ToolDto,
  TrainingMaterialDto,
  WorkflowDto,
} from '@/api/sshoc'
import {
  useRevertDataset,
  useRevertPublication,
  useRevertTool,
  useRevertTrainingMaterial,
  useRevertWorkflow,
} from '@/api/sshoc'
import { Button } from '@/elements/Button/Button'
import { toast } from '@/elements/Toast/useToast'
import { useAuth } from '@/modules/auth/AuthContext'
import ProtectedView from '@/modules/auth/ProtectedView'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import { Anchor } from '@/modules/ui/Anchor'

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
        <ItemVersion version={props.item} isCurrentApprovedVersion />
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
  isCurrentApprovedVersion?: boolean
}

/**
 * TODO: which versions is a user is allowed to see?
 * i.e. which requests for an item version will not error?
 */
function ItemVersion(props: ItemVersionProps) {
  const { version } = props
  type ItemCategory = Exclude<typeof version.category, 'step' | undefined>

  const router = useRouter()
  const auth = useAuth()
  const handleError = useErrorHandlers()
  const queryClient = useQueryClient()
  const operations = {
    dataset: {
      op: useRevertDataset,
      getByIdKey: 'getDataset',
      getAllKey: 'getDatasets',
    },
    publication: {
      op: useRevertPublication,
      getByIdKey: 'getPublication',
      getAllKey: 'getPublications',
    },
    'tool-or-service': {
      op: useRevertTool,
      getByIdKey: 'getTool',
      getAllKey: 'getTools',
    },
    'training-material': {
      op: useRevertTrainingMaterial,
      getByIdKey: 'getTrainingMaterial',
      getAllKey: 'getTrainingMaterials',
    },
    workflow: {
      op: useRevertWorkflow,
      getByIdKey: 'getWorkflow',
      getAllKey: 'getWorkflows',
    },
  }
  const { op, getByIdKey, getAllKey } = operations[
    version.category as ItemCategory
  ]
  const revert = op({
    onSuccess() {
      toast.success('Successfully reverted to version.')

      queryClient.invalidateQueries({ queryKey: ['itemSearch'] })
      queryClient.invalidateQueries({ queryKey: [getAllKey] })
      queryClient.invalidateQueries({
        queryKey: [getByIdKey, version.persistentId],
      })

      router.push({
        pathname: ['', version.category, version.persistentId].join('/'),
      })
    },
    onError(error) {
      toast.error('Failed to revert to version.')

      if (error instanceof Error) {
        handleError(error)
      }
    },
  })

  function onRevert() {
    revert.mutate([
      { id: version.persistentId!, versionId: version.id! },
      { token: auth.session?.accessToken },
    ])
  }

  return (
    <article className="flex justify-between px-4 py-4 border border-gray-200 rounded bg-gray-75">
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
      <div className="flex items-center space-x-4">
        <ProtectedView>
          {/* TODO: This should check for status=approved once we get status for versions. */}
          {props.isCurrentApprovedVersion === true ? (
            <Link
              passHref
              href={{
                pathname: [
                  '',
                  version.category,
                  version.persistentId,
                  'edit',
                ].join('/'),
              }}
            >
              <Anchor className="text-ui-base">Edit</Anchor>
            </Link>
          ) : null}
        </ProtectedView>
        <ProtectedView roles={['moderator', 'administrator']}>
          {props.isCurrentApprovedVersion !== true ? (
            <Button variant="link" onPress={onRevert}>
              Revert to this version
            </Button>
          ) : null}
        </ProtectedView>
      </div>
    </article>
  )
}
