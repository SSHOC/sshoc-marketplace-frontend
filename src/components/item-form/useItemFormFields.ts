import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import type { DatasetFormFields } from '@/components/item-form/useDatasetFormFields'
import type { PublicationFormFields } from '@/components/item-form/usePublicationFormFields'
import type { ToolFormFields } from '@/components/item-form/useToolFormFields'
import type { TrainingMaterialFormFields } from '@/components/item-form/useTrainingMaterialFormFields'
import type { WorkflowFormFields } from '@/components/item-form/useWorkflowFormFields'
import type { WorkflowStepFormFields } from '@/components/item-form/useWorkflowStepFormFields'
import type { ItemCategoryWithWorkflowStep } from '@/data/sshoc/api/item'

export interface ItemFormFieldsBase {
  category: ItemCategoryWithWorkflowStep
  fields: ItemFormBaseFields
}

export type ItemFormFields =
  | DatasetFormFields
  | PublicationFormFields
  | ToolFormFields
  | TrainingMaterialFormFields
  | WorkflowFormFields
  | WorkflowStepFormFields

export type ItemFormBaseFields = ReturnType<typeof useItemFormFields>

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useItemFormFields(prefix = '') {
  const t = useTranslations('authenticated')

  const fields = useMemo(() => {
    const fields = {
      label: {
        name: `${prefix}label`,
        label: t('fields.label.label'),
        description: t('fields.label.description'),
        isRequired: true,
      },
      version: {
        name: `${prefix}version`,
        label: t('fields.version.label'),
        description: t('fields.version.description'),
      },
      description: {
        name: `${prefix}description`,
        label: t('fields.description.label'),
        description: t('fields.description.description'),
        isRequired: true,
      },
      accessibleAt: {
        name: `${prefix}accessibleAt`,
        label: t('fields.accessibleAt.label.other'),
        itemLabel: t('fields.accessibleAt.label.one'),
        description: t('fields.accessibleAt.description'),
      },
      externalIds: {
        name: `${prefix}externalIds`,
        label: t('fields.externalIds.label.other'),
        itemLabel: t('fields.externalIds.label.one'),
        description: t('fields.externalIds.description'),
        fields: {
          identifier: {
            name: 'identifier',
            label: t('fields.externalIds.identifier.label'),
            description: t('fields.externalIds.identifier.description'),
          },
          identifierService: {
            name: 'identifierService.code',
            _root: 'identifierService',
            label: t('fields.externalIds.identifierService.label'),
            description: t('fields.externalIds.identifierService.description'),
          },
        },
      },
      contributors: {
        name: `${prefix}contributors`,
        label: t('fields.contributors.label.other'),
        itemLabel: t('fields.contributors.label.one'),
        description: t('fields.contributors.description'),
        fields: {
          role: {
            name: 'role.code',
            _root: 'role',
            label: t('fields.contributors.role.label'),
            description: t('fields.contributors.role.description'),
          },
          actor: {
            name: 'actor.id',
            _root: 'actor',
            label: t('fields.contributors.actor.label'),
            description: t('fields.contributors.actor.description'),
          },
        },
      },
      properties: {
        name: `${prefix}properties`,
        label: t('fields.properties.label.other'),
        itemLabel: t('fields.properties.label.one'),
        description: t('fields.properties.description'),
        fields: {
          type: {
            name: 'type.code',
            _root: 'type',
            label: t('fields.properties.type.label'),
            description: t('fields.properties.type.description'),
          },
          value: {
            name: 'value',
            label: t('fields.properties.value.label'),
            description: t('fields.properties.value.description'),
          },
          concept: {
            name: 'concept.uri',
            _root: 'concept',
            label: t('fields.properties.concept.label'),
            description: t('fields.properties.concept.description'),
          },
        },
      },
      relatedItems: {
        name: `${prefix}relatedItems`,
        label: t('fields.relatedItems.label.other'),
        itemLabel: t('fields.relatedItems.label.one'),
        description: t('fields.relatedItems.description'),
        fields: {
          relation: {
            name: 'relation.code',
            _root: 'relation',
            label: t('fields.relatedItems.relation.label'),
            description: t('fields.relatedItems.relation.description'),
          },
          item: {
            name: 'persistentId',
            label: t('fields.relatedItems.item.label'),
            description: t('fields.relatedItems.item.description'),
          },
        },
      },
      media: {
        name: `${prefix}media`,
        label: t('fields.media.label.other'),
        itemLabel: t('fields.media.label.one'),
        description: t('fields.media.description'),
        fields: {
          info: {
            name: 'info.mediaId',
            _root: 'info',
            label: t('fields.media.info.label'),
            description: t('fields.media.info.description'),
          },
          caption: {
            name: 'caption',
            label: t('fields.media.caption.label'),
            description: t('fields.media.caption.description'),
          },
          licence: {
            name: 'concept.code',
            _root: 'concept',
            label: t('fields.media.licence.label'),
            description: t('fields.media.licence.description'),
          },
        },
      },
      thumbnail: {
        name: `${prefix}thumbnail`,
        label: t('fields.thumbnail.label'),
        description: t('fields.thumbnail.description'),
        fields: {
          info: {
            name: 'info.mediaId',
            _root: 'info',
            label: t('fields.thumbnail.info.label'),
            description: t('fields.thumbnail.info.description'),
          },
          caption: {
            name: 'caption',
            label: t('fields.thumbnail.caption.label'),
            description: t('fields.thumbnail.caption.description'),
          },
          licence: {
            name: 'concept.code',
            _root: 'concept',
            label: t('fields.thumbnail.licence.label'),
            description: t('fields.thumbnail.licence.description'),
          },
        },
      },
    }

    return fields
  }, [prefix, t])

  return fields
}
