import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { LinkButton } from '@/components/common/LinkButton'
import css from '@/components/item/ItemControls.module.css'
import type { Item, ItemCategory } from '@/data/sshoc/api/item'
import { useDataset, useDeleteDataset } from '@/data/sshoc/hooks/dataset'
import { useDeletePublication, usePublication } from '@/data/sshoc/hooks/publication'
import { useDeleteTool, useTool } from '@/data/sshoc/hooks/tool-or-service'
import {
  useDeleteTrainingMaterial,
  useTrainingMaterial,
} from '@/data/sshoc/hooks/training-material'
import { useDeleteWorkflow, useWorkflow } from '@/data/sshoc/hooks/workflow'
import { isNotFoundError } from '@/data/sshoc/utils/isNotFoundError'
import { AccessControl } from '@/lib/core/auth/AccessControl'
import { itemRoutes } from '@/lib/core/navigation/item-routes'
import type { MutationMetadata, QueryMetadata } from '@/lib/core/query/types'
import { Button } from '@/lib/core/ui/Button/Button'

export interface ItemControlProps {
  category: ItemCategory
  persistentId: Item['persistentId']
}

export function ItemControls(props: ItemControlProps): JSX.Element {
  const { category, persistentId } = props

  const t = useTranslations('common')

  return (
    <AccessControl>
      <div className={css['container']}>
        <EditItemMenuButton category={category} persistentId={persistentId} />
        <LinkButton
          href={itemRoutes.ItemHistoryPage(category)({ persistentId })}
          color="secondary"
          size="xs"
        >
          {t('controls.history')}
        </LinkButton>
        <AccessControl roles={['administrator']}>
          <DeleteItemButton category={category} persistentId={persistentId} />
        </AccessControl>
      </div>
    </AccessControl>
  )
}

interface EditItemMenuButtonProps {
  category: ItemCategory
  persistentId: Item['persistentId']
}

function EditItemMenuButton(props: EditItemMenuButtonProps): JSX.Element {
  const { category, persistentId } = props

  const t = useTranslations('common')

  const meta: QueryMetadata = {
    messages: {
      error(error) {
        if (isNotFoundError(error)) return false
        return undefined
      },
    },
  }
  const suggested = useItem(category)({ persistentId, approved: false }, undefined, { meta })
  const draft = useItem(category)({ persistentId, draft: true }, undefined, { meta })

  return (
    <Fragment>
      <LinkButton
        href={itemRoutes.ItemEditPage(category)({ persistentId })}
        color="secondary"
        size="xs"
      >
        {t('controls.edit')}
      </LinkButton>
      {suggested.data != null && suggested.data.status === 'suggested' ? (
        <LinkButton
          href={itemRoutes.ItemEditVersionPage(category)({
            persistentId,
            versionId: suggested.data.id,
          })}
          color="secondary"
          size="xs"
        >
          {t('controls.edit-latest-suggestion')}
        </LinkButton>
      ) : null}
      {draft.data != null && draft.data.status === 'draft' ? (
        <LinkButton
          href={itemRoutes.ItemEditVersionPage(category)(
            {
              persistentId,
              versionId: draft.data.id,
            },
            { draft: true },
          )}
          color="secondary"
          size="xs"
        >
          {t('controls.edit-latest-draft')}
        </LinkButton>
      ) : null}
    </Fragment>
  )
}

interface DeleteItemButtonProps {
  category: ItemCategory
  persistentId: Item['persistentId']
}

function DeleteItemButton(props: DeleteItemButtonProps): JSX.Element {
  const { category, persistentId } = props

  const t = useTranslations('common')
  const router = useRouter()

  const label = t(`item-categories.${category}.one`)

  const meta: MutationMetadata = {
    messages: {
      mutate() {
        return t('controls.delete-item-pending', { category: label })
      },
      success() {
        return t('controls.delete-item-success', { category: label })
      },
      error() {
        return t('controls.delete-item-error', { category: label })
      },
    },
  }
  const deleteItem = useDeleteItem(category)({ persistentId }, undefined, {
    meta,
    onSuccess() {
      router.push(`/account`)
    },
  })

  function onDelete() {
    deleteItem.mutate()
  }

  return (
    <Button color="negative" onPress={onDelete} size="xs">
      {t('controls.delete')}
    </Button>
  )
}

function useItem(category: ItemCategory) {
  switch (category) {
    case 'dataset':
      return useDataset
    case 'publication':
      return usePublication
    case 'tool-or-service':
      return useTool
    case 'training-material':
      return useTrainingMaterial
    case 'workflow':
      return useWorkflow
  }
}

function useDeleteItem(category: ItemCategory) {
  switch (category) {
    case 'dataset':
      return useDeleteDataset
    case 'publication':
      return useDeletePublication
    case 'tool-or-service':
      return useDeleteTool
    case 'training-material':
      return useDeleteTrainingMaterial
    case 'workflow':
      return useDeleteWorkflow
  }
}
