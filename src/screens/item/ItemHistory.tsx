import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'

import type { ItemExtBasicDto } from '@/api/sshoc'
import {
  useGetDatasetHistory,
  useGetPublicationHistory,
  useGetToolHistory,
  useGetTrainingMaterialHistory,
  useGetWorkflowHistory,
  useRevertDataset,
  useRevertPublication,
  useRevertTool,
  useRevertTrainingMaterial,
  useRevertWorkflow,
} from '@/api/sshoc'
import type { Item, ItemCategory } from '@/api/sshoc/types'
import { Button } from '@/elements/Button/Button'
import { toast } from '@/elements/Toast/useToast'
import { useAuth } from '@/modules/auth/AuthContext'
import ProtectedView from '@/modules/auth/ProtectedView'
import { useErrorHandlers } from '@/modules/error/useErrorHandlers'
import { Anchor } from '@/modules/ui/Anchor'

export interface ItemHistoryProps {
  item: Item
}

export function ItemHistory(props: ItemHistoryProps): JSX.Element {
  const { item } = props
  const category = item.category as Exclude<ItemCategory, 'step'>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const itemHistory = useGetItemHistory(category, item.persistentId!)

  if (itemHistory.isLoading) {
    return <p>Loading</p>
  }

  if (itemHistory.isError) {
    return <p>Failed to fetch item history</p>
  }

  if (itemHistory.data === undefined) {
    return <p>No versions found.</p>
  }

  return (
    <ul className="space-y-2.5">
      {itemHistory.data.map((item) => {
        return (
          <li key={item.id}>
            <ItemVersion item={item} />
          </li>
        )
      })}
    </ul>
  )
}

function useGetItemHistory(category: ItemCategory, id: string) {
  switch (category) {
    case 'dataset':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useGetDatasetHistory({ id }, {})
    case 'publication':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useGetPublicationHistory({ id }, {})
    case 'tool-or-service':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useGetToolHistory({ id }, {})
    case 'training-material':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useGetTrainingMaterialHistory({ id }, {})
    case 'workflow':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useGetWorkflowHistory({ workflowId: id }, {})
    case 'step':
      throw new Error("Workflow steps don't have history.")
  }
}

interface ItemVersionProps {
  item: ItemExtBasicDto
}

function ItemVersion(props: ItemVersionProps) {
  const { item } = props
  const category = item.category as Exclude<ItemCategory, 'step'>

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
  const { op, getByIdKey, getAllKey } = operations[category]
  const revert = op({
    onSuccess() {
      toast.success('Successfully reverted to version.')

      queryClient.invalidateQueries({ queryKey: ['searchItems'] })
      queryClient.invalidateQueries({ queryKey: [getAllKey] })
      queryClient.invalidateQueries({
        queryKey: [
          getByIdKey,
          {
            [category === 'workflow' ? 'workflowId' : 'id']: item.persistentId,
          },
        ],
      })

      router.push({
        pathname: ['', item.category, item.persistentId].join('/'),
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
    if (category === 'workflow') {
      revert.mutate([
        // @ts-expect-error Ignore for now, refactor later
        { workflowId: item.persistentId, versionId: item.id },
        { token: auth.session?.accessToken },
      ])
    } else {
      revert.mutate([
        // @ts-expect-error Ignore for now, refactor later
        { id: item.persistentId, versionId: item.id },
        { token: auth.session?.accessToken },
      ])
    }
  }

  return (
    <div className="p-4 space-y-4 text-xs border border-gray-200 rounded bg-gray-75">
      <div className="flex items-center justify-between">
        <h2>
          <Link
            href={{
              pathname: [
                '',
                category,
                item.persistentId,
                'version',
                item.id,
              ].join('/'),
            }}
          >
            <a className="text-base font-bold transition text-primary-750 hover:text-secondary-600">
              {item.label}
              {item.version != null ? <span> ({item.version})</span> : null}
            </a>
          </Link>
        </h2>
        {item.lastInfoUpdate != null ? (
          <div className="space-x-1.5">
            <span className="text-gray-550">Date:</span>
            <LastUpdate isoDate={item.lastInfoUpdate} />
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-8">
          <div className="space-x-1.5">
            <span className="text-gray-550">Status:</span>
            <span>{item.status}</span>
          </div>
          <div className="space-x-1.5">
            <span className="text-gray-550">Contributor:</span>
            <span>{item.informationContributor?.displayName}</span>
            <a
              href={`mailto:${item.informationContributor?.email}`}
              className="transition text-primary-750 hover:text-secondary-600"
            >
              <span>{item.informationContributor?.email}</span>
            </a>
          </div>
        </div>
        <div className="text-sm">
          {item.status === 'approved' ? (
            <ProtectedView>
              <Link
                passHref
                href={{
                  pathname: ['', category, item.persistentId, 'edit'].join('/'),
                }}
              >
                <Anchor className="cursor-default text-ui-base">Edit</Anchor>
              </Link>
            </ProtectedView>
          ) : (
            <ProtectedView roles={['moderator', 'administrator']}>
              <Button variant="link" onPress={onRevert}>
                Revert to this version
              </Button>
            </ProtectedView>
          )}
        </div>
      </div>
    </div>
  )
}

interface LastUpdateProps {
  isoDate: string | undefined
}

function LastUpdate({ isoDate }: LastUpdateProps) {
  if (isoDate == null) return null
  const date = new Date(isoDate)

  return (
    <time dateTime={isoDate}>
      {Intl.DateTimeFormat('en', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/44632
        dateStyle: 'medium',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/44632
        timeStyle: 'short',
      }).format(date)}
    </time>
  )
}
