import type {
  Item,
  ItemContributor,
  ItemExternalId,
  ItemMedia,
  ItemsDiff,
  RelatedItem,
} from '@/data/sshoc/api/item'
import type { Property } from '@/data/sshoc/api/property'

// TODO: use faker

const meta: Pick<Item, 'category' | 'informationContributor' | 'lastInfoUpdate' | 'persistentId'> =
  {
    persistentId: '123',
    category: 'dataset',
    lastInfoUpdate: new Date(0).toISOString(),
    informationContributor: {
      id: 123,
      username: '123',
      displayName: '123',
      role: 'contributor',
      config: true,
      email: '123@example.com',
      registrationDate: new Date(0).toISOString(),
      status: 'enabled',
    },
  }

const image: ItemMedia = {
  info: {
    mediaId: '123',
    category: 'image',
    hasThumbnail: true,
    mimeType: 'image/png',
    location: { sourceUrl: 'http://example.com/image.png' },
  },
}

const externalId: ItemExternalId = {
  identifier: '123',
  identifierService: { code: '123', label: '123', ord: 1 },
}

const contributor: ItemContributor = {
  role: { code: '123', label: '123', ord: 1 },
  actor: { id: 123, name: '123', affiliations: [], externalIds: [] },
}

const property: Property = {
  type: {
    type: 'string',
    code: '123',
    label: '123',
    allowedVocabularies: [],
    ord: 1,
    hidden: false,
  },
  value: '123',
}

const relatedItem: RelatedItem = {
  relation: { code: '123', label: '123' },
  category: 'dataset',
  persistentId: '123',
  id: 123,
  label: '123',
  description: '123',
}

export const equal: { diff: ItemsDiff; initialValues: Item } = {
  diff: {
    equal: true,
    // approved version
    item: {
      id: 123,
      status: 'approved',
      ...meta,
      label: 'The label',
      description: 'The description',
      version: '1.0',
      dateCreated: new Date(0).toISOString(),
      dateLastUpdated: new Date(0).toISOString(),
      thumbnail: image,
      accessibleAt: ['http://approved.com'],
      externalIds: [externalId],
      contributors: [contributor],
      properties: [property],
      media: [image],
      relatedItems: [relatedItem],
    },
    // diff
    other: {
      id: 456,
      status: 'suggested',
      ...meta,
      version: 'unaltered',
      dateCreated: new Date(1).toISOString(),
      dateLastUpdated: new Date(1).toISOString(),
      /** thumbnail will be omitted by backend */
      accessibleAt: [null],
      externalIds: [null],
      contributors: [null],
      properties: [null],
      media: [null],
      relatedItems: [null],
    },
  },
  // suggested version
  initialValues: {
    ...meta,
    id: 456,
    status: 'suggested',
    label: 'The label',
    description: 'The description',
    version: '1.0',
    dateCreated: new Date(0).toISOString(),
    dateLastUpdated: new Date(0).toISOString(),
    thumbnail: image,
    accessibleAt: ['http://approved.com'],
    externalIds: [externalId],
    contributors: [contributor],
    properties: [property],
    media: [image],
    relatedItems: [relatedItem],
  },
}

export const changed: { diff: ItemsDiff; initialValues: Item } = {
  diff: {
    equal: false,
    // approved version
    item: {
      id: 123,
      status: 'approved',
      ...meta,
      label: 'The label',
      description: 'The description',
      version: '1.0',
      dateCreated: new Date(0).toISOString(),
      dateLastUpdated: new Date(0).toISOString(),
      thumbnail: image,
      accessibleAt: ['http://approved.com'],
      externalIds: [externalId],
      contributors: [contributor],
      properties: [property],
      media: [image],
      relatedItems: [relatedItem],
    },
    // diff
    other: {
      id: 456,
      status: 'suggested',
      ...meta,
      label: 'The changed label',
      description: 'The changed description',
      version: '2.0',
      dateCreated: new Date(2).toISOString(),
      dateLastUpdated: new Date(2).toISOString(),
      thumbnail: { ...image, info: { ...image.info, mediaId: '456' } },
      accessibleAt: ['http://suggested.com'],
      externalIds: [{ ...externalId, identifier: '456' }],
      contributors: [{ ...contributor, actor: { ...contributor.actor, id: 456 } }],
      properties: [{ ...property, value: '456' }],
      media: [{ ...image, info: { ...image.info, mediaId: '456' } }],
      relatedItems: [{ ...relatedItem, persistentId: '456' }],
    },
  },
  // suggested version
  initialValues: {
    id: 456,
    status: 'suggested',
    ...meta,
    label: 'The changed label',
    description: 'The changed description',
    version: '2.0',
    dateCreated: new Date(2).toISOString(),
    dateLastUpdated: new Date(2).toISOString(),
    thumbnail: { ...image, info: { ...image.info, mediaId: '456' } },
    accessibleAt: ['http://suggested.com'],
    externalIds: [{ ...externalId, identifier: '456' }],
    contributors: [{ ...contributor, actor: { ...contributor.actor, id: 456 } }],
    properties: [{ ...property, value: '456' }],
    media: [{ ...image, info: { ...image.info, mediaId: '456' } }],
    relatedItems: [{ ...relatedItem, persistentId: '456' }],
  },
}

export const deleted: { diff: ItemsDiff; initialValues: Item } = {
  diff: {
    equal: false,
    // approved version
    item: {
      id: 123,
      status: 'approved',
      ...meta,
      label: 'The label',
      description: 'The description',
      version: '1.0',
      dateCreated: new Date(0).toISOString(),
      dateLastUpdated: new Date(0).toISOString(),
      thumbnail: image,
      accessibleAt: ['http://approved.com'],
      externalIds: [externalId],
      contributors: [contributor],
      properties: [property],
      media: [image],
      relatedItems: [relatedItem],
    },
    // diff
    other: {
      id: 456,
      status: 'suggested',
      ...meta,
      accessibleAt: [],
      externalIds: [],
      contributors: [],
      properties: [],
      media: [],
      relatedItems: [],
    },
  },
  // suggested version
  initialValues: {
    id: 456,
    status: 'suggested',
    ...meta,
    label: 'The label',
    description: 'The description',
    accessibleAt: [],
    externalIds: [],
    contributors: [],
    properties: [],
    media: [],
    relatedItems: [],
  },
}

export const inserted: { diff: ItemsDiff; initialValues: Item } = {
  diff: {
    equal: false,
    // approved version
    item: {
      id: 123,
      status: 'approved',
      ...meta,
      label: 'The label',
      description: 'The description',
      accessibleAt: [],
      externalIds: [],
      contributors: [],
      properties: [],
      media: [],
      relatedItems: [],
    },
    // diff
    other: {
      id: 456,
      status: 'suggested',
      ...meta,
      version: '1.0',
      dateCreated: new Date(0).toISOString(),
      dateLastUpdated: new Date(0).toISOString(),
      thumbnail: image,
      accessibleAt: ['http://approved.com'],
      externalIds: [externalId],
      contributors: [contributor],
      properties: [property],
      media: [image],
      relatedItems: [relatedItem],
    },
  },
  // suggested version
  initialValues: {
    id: 456,
    status: 'suggested',
    ...meta,
    label: 'The label',
    description: 'The description',
    version: '1.0',
    dateCreated: new Date(0).toISOString(),
    dateLastUpdated: new Date(0).toISOString(),
    thumbnail: image,
    accessibleAt: ['http://approved.com'],
    externalIds: [externalId],
    contributors: [contributor],
    properties: [property],
    media: [image],
    relatedItems: [relatedItem],
  },
}
