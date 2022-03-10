import type { Item, ItemCategory } from '@/data/sshoc/api/item'
import { usePublishPermission } from '@/data/sshoc/utils/usePublishPermission'
import { useI18n } from '@/lib/core/i18n/useI18n'
import type { MutationMetadata } from '@/lib/core/query/types'

export interface useUpdateItemMetaArgs {
  category: ItemCategory
}

export function useUpdateItemMeta(
  args: useUpdateItemMetaArgs,
): MutationMetadata<Item, Error, { draft?: boolean }> {
  const { category } = args

  const { t } = useI18n<'authenticated' | 'common'>()
  const hasPublishPermission = usePublishPermission()
  const label = t(['common', 'item-categories', category, 'one'])

  const meta: MutationMetadata<Item, Error, { draft?: boolean }> = {
    messages: {
      mutate(variables) {
        return t(
          [
            'authenticated',
            'forms',
            variables.draft === true
              ? 'update-item-draft-pending'
              : hasPublishPermission
              ? 'update-item-pending'
              : 'update-item-suggestion-pending',
          ],
          {
            values: { category: label },
          },
        )
      },
      success(data, variables) {
        return t(
          [
            'authenticated',
            'forms',
            variables.draft === true
              ? 'update-item-draft-success'
              : hasPublishPermission
              ? 'update-item-success'
              : 'update-item-suggestion-success',
          ],
          {
            values: { category: label },
          },
        )
      },
      error(error, variables) {
        return t(
          [
            'authenticated',
            'forms',
            variables.draft === true
              ? 'update-item-draft-error'
              : hasPublishPermission
              ? 'update-item-error'
              : 'update-item-suggestion-error',
          ],
          {
            values: { category: label },
          },
        )
      },
    },
  }

  return meta
}
