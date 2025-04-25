import { useMemo } from 'react'

import type { DatasetFormFields } from '@/components/item-form/useDatasetFormFields'
import type { PublicationFormFields } from '@/components/item-form/usePublicationFormFields'
import type { ToolFormFields } from '@/components/item-form/useToolFormFields'
import type { TrainingMaterialFormFields } from '@/components/item-form/useTrainingMaterialFormFields'
import type { WorkflowFormFields } from '@/components/item-form/useWorkflowFormFields'
import type { WorkflowStepFormFields } from '@/components/item-form/useWorkflowStepFormFields'
import type { ItemCategoryWithWorkflowStep } from '@/data/sshoc/api/item'
import { useI18n } from '@/lib/core/i18n/useI18n'

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

 
export function useItemFormFields(prefix = '') {
  const { t } = useI18n<'authenticated'>()

  const fields = useMemo(() => {
    const fields = {
      label: {
        name: `${prefix}label`,
        label: t(['authenticated', 'fields', 'label', 'label']),
        description: t(['authenticated', 'fields', 'label', 'description']),
        isRequired: true,
      },
      description: {
        name: `${prefix}description`,
        label: t(['authenticated', 'fields', 'description', 'label']),
        description: t(['authenticated', 'fields', 'description', 'description']),
        isRequired: true,
      },
      accessibleAt: {
        name: `${prefix}accessibleAt`,
        label: t(['authenticated', 'fields', 'accessibleAt', 'label', 'other']),
        itemLabel: t(['authenticated', 'fields', 'accessibleAt', 'label', 'one']),
        description: t(['authenticated', 'fields', 'accessibleAt', 'description']),
        isRequired: true,
      },
      version: {
        name: `${prefix}version`,
        label: t(['authenticated', 'fields', 'version', 'label']),
        description: t(['authenticated', 'fields', 'version', 'description']),
      },
      externalIds: {
        name: `${prefix}externalIds`,
        label: t(['authenticated', 'fields', 'externalIds', 'label', 'other']),
        itemLabel: t(['authenticated', 'fields', 'externalIds', 'label', 'one']),
        description: t(['authenticated', 'fields', 'externalIds', 'description']),
        fields: {
          identifier: {
            name: 'identifier',
            label: t(['authenticated', 'fields', 'externalIds.identifier', 'label']),
            description: t(['authenticated', 'fields', 'externalIds.identifier', 'description']),
          },
          identifierService: {
            name: 'identifierService.code',
            _root: 'identifierService',
            label: t(['authenticated', 'fields', 'externalIds.identifierService', 'label']),
            description: t([
              'authenticated',
              'fields',
              'externalIds.identifierService',
              'description',
            ]),
          },
        },
      },
      contributors: {
        name: `${prefix}contributors`,
        label: t(['authenticated', 'fields', 'contributors', 'label', 'other']),
        itemLabel: t(['authenticated', 'fields', 'contributors', 'label', 'one']),
        description: t(['authenticated', 'fields', 'contributors', 'description']),
        fields: {
          role: {
            name: 'role.code',
            _root: 'role',
            label: t(['authenticated', 'fields', 'contributors.role', 'label']),
            description: t(['authenticated', 'fields', 'contributors.role', 'description']),
          },
          actor: {
            name: 'actor.id',
            _root: 'actor',
            label: t(['authenticated', 'fields', 'contributors.actor', 'label']),
            description: t(['authenticated', 'fields', 'contributors.actor', 'description']),
          },
        },
      },
      properties: {
        name: `${prefix}properties`,
        label: t(['authenticated', 'fields', 'properties', 'label', 'other']),
        itemLabel: t(['authenticated', 'fields', 'properties', 'label', 'one']),
        description: t(['authenticated', 'fields', 'properties', 'description']),
        fields: {
          type: {
            name: 'type.code',
            _root: 'type',
            label: t(['authenticated', 'fields', 'properties.type', 'label']),
            description: t(['authenticated', 'fields', 'properties.type', 'description']),
          },
          value: {
            name: 'value',
            label: t(['authenticated', 'fields', 'properties.value', 'label']),
            description: t(['authenticated', 'fields', 'properties.value', 'description']),
          },
          concept: {
            name: 'concept.uri',
            _root: 'concept',
            label: t(['authenticated', 'fields', 'properties.concept', 'label']),
            description: t(['authenticated', 'fields', 'properties.concept', 'description']),
          },
        },
      },
      relatedItems: {
        name: `${prefix}relatedItems`,
        label: t(['authenticated', 'fields', 'relatedItems', 'label', 'other']),
        itemLabel: t(['authenticated', 'fields', 'relatedItems', 'label', 'one']),
        description: t(['authenticated', 'fields', 'relatedItems', 'description']),
        fields: {
          relation: {
            name: 'relation.code',
            _root: 'relation',
            label: t(['authenticated', 'fields', 'relatedItems.relation', 'label']),
            description: t(['authenticated', 'fields', 'relatedItems.relation', 'description']),
          },
          item: {
            name: 'persistentId',
            label: t(['authenticated', 'fields', 'relatedItems.item', 'label']),
            description: t(['authenticated', 'fields', 'relatedItems.item', 'description']),
          },
        },
      },
      media: {
        name: `${prefix}media`,
        label: t(['authenticated', 'fields', 'media', 'label', 'other']),
        itemLabel: t(['authenticated', 'fields', 'media', 'label', 'one']),
        description: t(['authenticated', 'fields', 'media', 'description']),
        fields: {
          info: {
            name: 'info.mediaId',
            _root: 'info',
            label: t(['authenticated', 'fields', 'media.info', 'label']),
            description: t(['authenticated', 'fields', 'media.info', 'description']),
          },
          caption: {
            name: 'caption',
            label: t(['authenticated', 'fields', 'media.caption', 'label']),
            description: t(['authenticated', 'fields', 'media.caption', 'description']),
          },
          licence: {
            name: 'concept.code',
            _root: 'concept',
            label: t(['authenticated', 'fields', 'media.licence', 'label']),
            description: t(['authenticated', 'fields', 'media.licence', 'description']),
          },
        },
      },
      thumbnail: {
        name: `${prefix}thumbnail`,
        label: t(['authenticated', 'fields', 'thumbnail', 'label']),
        description: t(['authenticated', 'fields', 'thumbnail', 'description']),
        fields: {
          info: {
            name: 'info.mediaId',
            _root: 'info',
            label: t(['authenticated', 'fields', 'thumbnail.info', 'label']),
            description: t(['authenticated', 'fields', 'thumbnail.info', 'description']),
          },
          caption: {
            name: 'caption',
            label: t(['authenticated', 'fields', 'thumbnail.caption', 'label']),
            description: t(['authenticated', 'fields', 'thumbnail.caption', 'description']),
          },
          licence: {
            name: 'concept.code',
            _root: 'concept',
            label: t(['authenticated', 'fields', 'thumbnail.licence', 'label']),
            description: t(['authenticated', 'fields', 'thumbnail.licence', 'description']),
          },
        },
      },
    }

    return fields
  }, [prefix, t])

  return fields
}
