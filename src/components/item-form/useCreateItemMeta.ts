import type { Item, ItemCategory } from '@/data/sshoc/api/item'
import { usePublishPermission } from '@/data/sshoc/utils/usePublishPermission'
import { useI18n } from '@/lib/core/i18n/useI18n'
import type { MutationMetadata } from '@/lib/core/query/types'

export interface useCreateItemMetaArgs {
  category: ItemCategory
}

export function useCreateItemMeta(
  args: useCreateItemMetaArgs,
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
              ? 'create-item-draft-pending'
              : hasPublishPermission
                ? 'create-item-pending'
                : 'create-item-suggestion-pending',
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
              ? 'create-item-draft-success'
              : hasPublishPermission
                ? 'create-item-success'
                : 'create-item-suggestion-success',
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
              ? 'create-item-draft-error'
              : hasPublishPermission
                ? 'create-item-error'
                : 'create-item-suggestion-error',
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
