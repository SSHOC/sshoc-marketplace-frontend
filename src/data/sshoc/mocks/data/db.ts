import { faker } from '@faker-js/faker'
import * as jwt from 'jose'
import { matchSorter } from 'match-sorter'

import type { Actor, ActorRole, ActorSource } from '@/data/sshoc/api/actor'
import type { PaginatedResponse } from '@/data/sshoc/api/common'
import type { Dataset } from '@/data/sshoc/api/dataset'
import type {
  ItemBase,
  ItemCategoryWithWorkflowStep,
  ItemFacet,
  ItemRelation,
  ItemSearch,
  ItemSearchResult,
  ItemSource,
  ItemWithWorkflowStep,
} from '@/data/sshoc/api/item'
import { itemFacets, itemStatus } from '@/data/sshoc/api/item'
import type { MediaDetails, MediaDetailsBase } from '@/data/sshoc/api/media'
import { mediaCategories } from '@/data/sshoc/api/media'
import type { Property, PropertyType, PropertyTypeBase } from '@/data/sshoc/api/property'
import { isPropertyConcept, propertyTypeType } from '@/data/sshoc/api/property'
import type { Publication } from '@/data/sshoc/api/publication'
import type { Source, SourceBase } from '@/data/sshoc/api/source'
import type { Tool } from '@/data/sshoc/api/tool-or-service'
import type { TrainingMaterial } from '@/data/sshoc/api/training-material'
import type { User } from '@/data/sshoc/api/user'
import { userRoles, userStatus } from '@/data/sshoc/api/user'
import type { Vocabulary, VocabularyBase } from '@/data/sshoc/api/vocabulary'
import type { Workflow } from '@/data/sshoc/api/workflow'
import type { WorkflowStep } from '@/data/sshoc/api/workflow-step'
import { capitalize, identity, includes, isNonEmptyString, pick, times } from '@/lib/utils'

const { datatype, name, date, internet, random, lorem, system } = faker

/** Ensure reproducible random values for model properties. */
export const seed = 123
faker.seed(seed)

function getRandomElement<T>(map: Map<number | string, T>): T {
  const id = random.arrayElement(Array.from(map.keys()))
  return map.get(id) as T
}

function optional<T>(type: T) {
  return datatype.boolean() ? type : undefined
}

type Serializer<I, O> = (obj: I) => O

export function page<K extends string, V>(
  obj: Record<K, Array<V>>,
): PaginatedResponse<Record<K, Array<V>>>
export function page<K extends string, V>(
  obj: Record<K, Array<V>>,
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  options: { page?: number },
): PaginatedResponse<Record<K, Array<V>>>
export function page<K extends string, V, O>(
  obj: Record<K, Array<V>>,
  options: { page?: number; serialize: Serializer<V, O> },
): PaginatedResponse<Record<K, Array<O>>>
export function page<K extends string, V, O>(
  obj: Record<K, Array<V>>,
  { page = 1, serialize }: { page?: number; serialize?: Serializer<V, O> } = {},
): PaginatedResponse<Record<K, Array<unknown>>> {
  const perPage = 20
  const start = (page - 1) * perPage
  const serializer = serialize ?? identity
  const key = Object.keys(obj)[0] as K
  const items = Object.values(obj)[0] as Array<V>
  const results = items.slice(start, start + perPage).map(serializer)

  return {
    hits: items.length,
    count: results.length,
    page,
    perpage: perPage,
    pages: Math.ceil(items.length / perPage),
    [key]: results,
  } as PaginatedResponse<Record<K, Array<unknown>>>
}

const userStore = new Map<number, User>()
const userSecretStore = new Map<number, UserSecret>()
const actorStore = new Map<number, Actor>()
const actorRoleStore = new Map<string, ActorRole>()
const actorSourceStore = new Map<string, ActorSource>()
const sourceStore = new Map<number, Source>()
const vocabularyStore = new Map<string, Vocabulary>()
const mediaStore = new Map()
const propertyTypeStore = new Map<string, PropertyType>()
const itemSourceStore = new Map<string, ItemSource>()
const itemRelationStore = new Map()
const itemStore = new Map<string, ItemWithWorkflowStep>()
const datasetStore = new Map<string, Dataset>()
const publicationStore = new Map<string, Publication>()
const toolStore = new Map<string, Tool>()
const trainingMaterialStore = new Map<string, TrainingMaterial>()
const workflowStore = new Map<string, Workflow>()
const workflowStepStore = new Map<string, WorkflowStep>()

const facetStores = new Map<ItemFacet, Map<string, Set<unknown>>>(
  itemFacets.map((facet) => {
    return [facet, new Map()]
  }),
)

const actor = {
  clear(): void {
    actorStore.clear()
  },
  generate(): Actor {
    const _actor: Actor = {
      id: datatype.number(),
      name: name.findName(),
      externalIds: times(datatype.number(Math.min(2, actorSourceStore.size))).map(() => {
        return {
          identifierService: actorSource.get(),
          identifier: datatype.uuid(),
        }
      }),
      website: optional(internet.url()),
      email: optional(internet.email()),
      affiliations: times(datatype.number(Math.min(2, actorStore.size))).map(() => {
        return actor.get()
      }),
    }
    return _actor
  },
  create(actor: Actor): Actor {
    actorStore.set(actor.id, actor)
    return actor
  },
  get(): Actor {
    return getRandomElement(actorStore)
  },
  getById(id: number): Actor | undefined {
    return actorStore.get(id)
  },
}

const actorRole = {
  clear(): void {
    actorRoleStore.clear()
  },
  generate(): ActorRole {
    const _actorRole: ActorRole = {
      code: datatype.uuid(),
      label: capitalize(lorem.word()),
      ord: datatype.number(),
    }
    return _actorRole
  },
  create(actorRole: ActorRole): ActorRole {
    actorRoleStore.set(actorRole.code, actorRole)
    return actorRole
  },
  get(): ActorRole {
    return getRandomElement(actorRoleStore)
  },
  getById(id: string): ActorRole | undefined {
    return actorRoleStore.get(id)
  },
}

const actorSource = {
  clear(): void {
    actorSourceStore.clear()
  },
  generate(): ActorSource {
    const _actorSource: ActorSource = {
      code: datatype.uuid(),
      label: capitalize(lorem.words()),
      ord: datatype.number(),
      urlTemplate: optional(internet.url()),
    }
    return _actorSource
  },
  create(actorSource: ActorSource): ActorSource {
    actorSourceStore.set(actorSource.code, actorSource)
    return actorSource
  },
  get(): ActorSource {
    return getRandomElement(actorSourceStore)
  },
  getById(id: string): ActorSource | undefined {
    return actorSourceStore.get(id)
  },
}

const itemSource = {
  clear(): void {
    itemSourceStore.clear()
  },
  generate(): ItemSource {
    const _itemSource: ItemSource = {
      code: datatype.uuid(),
      label: capitalize(lorem.words()),
      ord: datatype.number(),
      urlTemplate: optional(internet.url()),
    }
    return _itemSource
  },
  create(itemSource: ItemSource): ItemSource {
    itemSourceStore.set(itemSource.code, itemSource)
    return itemSource
  },
  get(): ItemSource {
    return getRandomElement(itemSourceStore)
  },
  getById(id: string): ItemSource | undefined {
    return itemSourceStore.get(id)
  },
}

const source = {
  clear(): void {
    sourceStore.clear()
  },
  generate(): Source {
    const _source: Source = {
      id: datatype.number(),
      label: capitalize(lorem.words()),
      url: internet.url(),
      urlTemplate: internet.url(),
      lastHarvestedDate: optional(date.recent().toISOString()),
    }
    return _source
  },
  create(source: Source): Source {
    sourceStore.set(source.id, source)
    return source
  },
  get(): Source {
    return getRandomElement(sourceStore)
  },
  getById(id: number): Source | undefined {
    return sourceStore.get(id)
  },
}

const vocabulary = {
  clear(): void {
    vocabularyStore.clear()
  },
  generate(): Vocabulary {
    const _vocabulary: VocabularyBase = {
      code: datatype.uuid(),
      label: capitalize(lorem.words()),
      closed: datatype.boolean(),
      accessibleAt: optional(internet.url()),
    }
    const _concepts = times(datatype.number({ min: 5, max: 50 })).map(() => {
      return {
        code: datatype.uuid(),
        vocabulary: { ..._vocabulary },
        label: capitalize(lorem.words()),
        notation: lorem.word(),
        definition: optional(lorem.words()),
        uri: internet.url(),
        candidate: datatype.boolean(),
        relatedConcepts: [],
      }
    })
    return {
      ..._vocabulary,
      description: optional(lorem.paragraph()),
      conceptResults: page({ concepts: _concepts }),
    }
  },
  create(vocabulary: Vocabulary): Vocabulary {
    vocabularyStore.set(vocabulary.code, vocabulary)
    return vocabulary
  },
  get(): Vocabulary {
    return getRandomElement(vocabularyStore)
  },
  getById(id: string): Vocabulary | undefined {
    return vocabularyStore.get(id)
  },
}

const media = {
  clear(): void {
    mediaStore.clear()
  },
  generate(): MediaDetails {
    const isLocalFile = datatype.boolean()
    const _mediaBase: MediaDetailsBase = {
      mediaId: datatype.uuid(),
      category: random.arrayElement(mediaCategories),
      mimeType: system.mimeType(),
      hasThumbnail: datatype.boolean(),
    }
    if (isLocalFile) {
      return {
        ..._mediaBase,
        filename: system.fileName(),
      }
    }
    return {
      ..._mediaBase,
      location: {
        sourceUrl: internet.url(),
      },
    }
  },
  create(media: MediaDetails): MediaDetails {
    mediaStore.set(media.mediaId, media)
    return media
  },
  get(): MediaDetails {
    return getRandomElement(mediaStore)
  },
  getById(id: string): MediaDetails | undefined {
    return mediaStore.get(id)
  },
}

const propertyType = {
  clear(): void {
    propertyTypeStore.clear()
  },
  generate(): PropertyType {
    const _type = random.arrayElement(propertyTypeType)
    const _propertyTypeBase: Omit<PropertyTypeBase, 'type'> = {
      code: datatype.uuid(),
      label: capitalize(lorem.words()),
      groupName: optional(lorem.word()),
      hidden: datatype.boolean(),
      ord: datatype.number(),
    }
    if (_type === 'concept') {
      return {
        ..._propertyTypeBase,
        type: _type,
        allowedVocabularies: times(datatype.number(Math.min(2, vocabularyStore.size))).map(() => {
          return vocabulary.get()
        }),
      }
    }
    return {
      ..._propertyTypeBase,
      type: _type,
      allowedVocabularies: [],
    }
  },
  create(propertyType: PropertyType): PropertyType {
    propertyTypeStore.set(propertyType.code, propertyType)
    return propertyType
  },
  get(): PropertyType {
    return getRandomElement(propertyTypeStore)
  },
  getById(id: string): PropertyType | undefined {
    return propertyTypeStore.get(id)
  },
}

const itemRelation = {
  clear(): void {
    itemRelationStore.clear()
  },
  generate(): ItemRelation {
    const _itemRelation: ItemRelation = {
      code: datatype.uuid(),
      label: capitalize(lorem.words()),
      inverseOf: itemRelationStore.size > 0 ? optional(itemRelation.get().code) : undefined,
    }
    return _itemRelation
  },
  create(itemRelation: ItemRelation): ItemRelation {
    itemRelationStore.set(itemRelation.code, itemRelation)
    return itemRelation
  },
  get(): ItemRelation {
    return getRandomElement(itemRelationStore)
  },
  getById(id: string): ItemRelation | undefined {
    return itemRelationStore.get(id)
  },
}

const facets = {
  get(facet: ItemFacet): Map<string, Set<unknown>> {

    return facetStores.get(facet)!
  },
  addProperties(properties: Array<Property>): void {
    properties.forEach((property) => {
      this.addProperty(property)
    })
  },
  addProperty(property?: Property): void {
    if (property == null) {return}
    if (!includes(itemFacets, property.type.code)) {return}


    const store = facetStores.get(property.type.code)!
    const value = isPropertyConcept(property) ? property.concept.label : property.value
    if (!store.has(value)) {
      store.set(value, new Set())
    }

    store.get(value)!.add(property)
  },
  addSource(source?: SourceBase): void {
    if (source == null) {return}


    const store = facetStores.get('source')!
    if (!store.has(source.label)) {
      store.set(source.label, new Set())
    }

    store.get(source.label)!.add(source.id)
  },
}

const item = {
  clear(): void {
    itemStore.clear()
  },
  generate(partial?: Partial<Omit<ItemBase, 'category'>>): Omit<ItemBase, 'category'> {
    const _item: Omit<ItemBase, 'category'> = {
      persistentId: datatype.uuid(),
      id: datatype.number(),
      label: capitalize(lorem.words()),
      version: optional(system.semver()),
      lastInfoUpdate: date.recent().toISOString(),
      status: random.arrayElement(itemStatus),
      informationContributor: user.get(),
      description: lorem.paragraph(),
      contributors: times(datatype.number(Math.min(3, actorStore.size, actorRoleStore.size))).map(
        () => {
          return {
            actor: actor.get(),
            role: actorRole.get(),
          }
        },
      ),
      properties: times(datatype.number(12)).map(() => {
        const _type = propertyType.get()
        if (_type.type === 'concept') {
          return {
            type: _type,
            concept: random.arrayElement(vocabulary.get().conceptResults.concepts),
          }
        }
        return {
          type: _type,
          value: lorem.words(),
        }
      }),
      externalIds: times(datatype.number(2)).map(() => {
        return {
          identifier: datatype.uuid(),
          identifierService: itemSource.get(),
        }
      }),
      accessibleAt: times(datatype.number(3)).map(() => {
        return internet.url()
      }),
      source: optional(source.get()),
      sourceItemId: optional(datatype.uuid()),
      relatedItems: times(datatype.number(Math.min(3, itemStore.size))).map(() => {
        const _item = item.get()
        const category = _item.category
        const _relatedItemBase = {
          persistentId: datatype.uuid(),
          id: datatype.number(),
          label: capitalize(lorem.words()),
          description: lorem.paragraphs(),
          relation: itemRelation.get(),
        }
        if (category === 'step') {
          return {
            ..._relatedItemBase,
            category,
            workflowId: workflow.get().persistentId,
          }
        }
        return {
          category,
          ..._relatedItemBase,
        }
      }),
      media: times(datatype.number(Math.min(3, mediaStore.size))).map(() => {
        return {
          info: media.get(),
          caption: lorem.words(),
          // concept: concept.get(),
        }
      }),
      thumbnail: optional({
        info: media.get(),
        caption: lorem.words(),
        // concept: concept.get(),
      }),
      ...partial,
    }
    return _item
  },
  get(): ItemWithWorkflowStep {
    return getRandomElement(itemStore)
  },
  getById(id: string): ItemWithWorkflowStep | undefined {
    return itemStore.get(id)
  },
  find(
    itemCategories: Array<ItemCategoryWithWorkflowStep>,
    q?: string,
    facets?: Record<ItemFacet, string>,
  ): ItemSearch.Response {
    const items: Array<ItemWithWorkflowStep> = []
    const categories = Array.from(new Set(itemCategories))

    if (categories.length === 0) {
      items.push(...itemStore.values())
    } else {
      categories.forEach((category) => {
        switch (category) {
          case 'dataset':
            items.push(...datasetStore.values())
            break
          case 'publication':
            items.push(...publicationStore.values())
            break
          case 'tool-or-service':
            items.push(...toolStore.values())
            break
          case 'training-material':
            items.push(...trainingMaterialStore.values())
            break
          case 'workflow':
            items.push(...workflowStore.values())
            break
          case 'step':
            items.push(...workflowStepStore.values())
            break
        }
      })
    }

    const _matches = isNonEmptyString(q) ? matchSorter(items, q, { keys: ['label'] }) : items

    const keys: Record<ItemFacet, string> = {
      activity: 'properties.*.type.code.activity',
      keyword: 'properties.*.type.code.keyword',
      source: 'source.identifierService.code',
    }

    const matches = Object.entries(facets ?? {}).reduce((acc, [facet, value]) => {
      if (isNonEmptyString(value) && facet in keys) {
        const key = keys[facet as ItemFacet]
        return matchSorter(acc, value, { keys: [key] })
      }
      return acc
    }, _matches)

    const counts: ItemSearch.Response['categories'] = {
      dataset: { count: 0, checked: false, label: 'Datasets' },
      publication: { count: 0, checked: false, label: 'Publications' },
      'tool-or-service': { count: 0, checked: false, label: 'Tools & Services' },
      'training-material': { count: 0, checked: false, label: 'Training Materials' },
      workflow: { count: 0, checked: false, label: 'Workflows' },
      step: { count: 0, checked: false, label: 'Steps' },
    }
    matches.forEach((item) => {
      if (item.category === 'step') {return}
      return counts[item.category].count++
    })

    const facetValues: ItemSearch.Response['facets'] = {
      activity: {},
      keyword: {},
      source: {},
    }
    itemFacets.forEach((facet) => {
      const store = db.facets.get(facet)
      const values: Record<string, { count: number; checked: boolean }> = {}
      store.forEach((value, key) => {
        // TODO: count = intersection of facets and matches
        values[key] = { count: value.size, checked: false }
      })
      facetValues[facet] = values
    })

    const serialize = this.serialize
    const results = page({ items: matches }, { serialize })

    return { ...results, order: ['score'], categories: counts, facets: facetValues }
  },
  serialize(item: ItemWithWorkflowStep): ItemSearchResult {
    return pick(item, [
      'category',
      'persistentId',
      'id',
      'label',
      'lastInfoUpdate',
      'status',
      'description',
      'contributors',
      'properties',
    ]) as ItemSearchResult
  },
}

const dataset = {
  clear(): void {
    datasetStore.clear()
  },
  generate(partial?: Partial<Dataset>): Dataset {
    const _dataset: Dataset = {
      ...item.generate(),
      category: 'dataset',
      dateCreated: optional(date.past().toISOString()),
      dateLastUpdated: optional(date.recent().toISOString()),
      ...partial,
    }
    return _dataset
  },
  create(dataset: Dataset): Dataset {
    itemStore.set(dataset.persistentId, dataset)
    facets.addProperties(dataset.properties)
    facets.addSource(dataset.source)
    datasetStore.set(dataset.persistentId, dataset)
    return dataset
  },
  get(): Dataset {
    return getRandomElement(datasetStore)
  },
  getById(id: string): Dataset | undefined {
    return datasetStore.get(id)
  },
}

const publication = {
  clear(): void {
    publicationStore.clear()
  },
  generate(partial?: Partial<Publication>): Publication {
    const _publication: Publication = {
      ...item.generate(),
      category: 'publication',
      dateCreated: optional(date.past().toISOString()),
      dateLastUpdated: optional(date.recent().toISOString()),
      ...partial,
    }
    return _publication
  },
  create(publication: Publication): Publication {
    itemStore.set(publication.persistentId, publication)
    facets.addProperties(publication.properties)
    facets.addSource(publication.source)
    publicationStore.set(publication.persistentId, publication)
    return publication
  },
  get(): Publication {
    return getRandomElement(publicationStore)
  },
  getById(id: string): Publication | undefined {
    return publicationStore.get(id)
  },
}

const tool = {
  clear(): void {
    toolStore.clear()
  },
  generate(partial?: Partial<Tool>): Tool {
    const _tool: Tool = {
      ...item.generate(),
      category: 'tool-or-service',
      ...partial,
    }
    return _tool
  },
  create(tool: Tool): Tool {
    itemStore.set(tool.persistentId, tool)
    facets.addProperties(tool.properties)
    facets.addSource(tool.source)
    toolStore.set(tool.persistentId, tool)
    return tool
  },
  get(): Tool {
    return getRandomElement(toolStore)
  },
  getById(id: string): Tool | undefined {
    return toolStore.get(id)
  },
}

const trainingMaterial = {
  clear(): void {
    trainingMaterialStore.clear()
  },
  generate(partial?: Partial<TrainingMaterial>): TrainingMaterial {
    const _trainingMaterial: TrainingMaterial = {
      ...item.generate(),
      category: 'training-material',
      dateCreated: optional(date.past().toISOString()),
      dateLastUpdated: optional(date.recent().toISOString()),
      ...partial,
    }
    return _trainingMaterial
  },
  create(trainingMaterial: TrainingMaterial): TrainingMaterial {
    itemStore.set(trainingMaterial.persistentId, trainingMaterial)
    facets.addProperties(trainingMaterial.properties)
    facets.addSource(trainingMaterial.source)
    trainingMaterialStore.set(trainingMaterial.persistentId, trainingMaterial)
    return trainingMaterial
  },
  get(): TrainingMaterial {
    return getRandomElement(trainingMaterialStore)
  },
  getById(id: string): TrainingMaterial | undefined {
    return trainingMaterialStore.get(id)
  },
}

const workflow = {
  clear(): void {
    workflowStore.clear()
  },
  generate(partial?: Partial<Workflow>): Workflow {
    const _workflow: Workflow = {
      ...item.generate(),
      category: 'workflow',
      composedOf: times(datatype.number(6)).map(() => {
        return workflowStep.generate()
      }),
      ...partial,
    }
    return _workflow
  },
  create(workflow: Workflow): Workflow {
    itemStore.set(workflow.persistentId, workflow)
    facets.addProperties(workflow.properties)
    facets.addSource(workflow.source)
    workflowStore.set(workflow.persistentId, workflow)
    return workflow
  },
  get(): Workflow {
    return getRandomElement(workflowStore)
  },
  getById(id: string): Workflow | undefined {
    return workflowStore.get(id)
  },
}

const workflowStep = {
  clear(): void {
    workflowStepStore.clear()
  },
  generate(partial?: Partial<WorkflowStep>): WorkflowStep {
    const _workflowStep: WorkflowStep = {
      ...item.generate(),
      category: 'step',
      composedOf: [],
      ...partial,
    }
    return _workflowStep
  },
  create(workflowStep: WorkflowStep): WorkflowStep {
    itemStore.set(workflowStep.persistentId, workflowStep)
    facets.addProperties(workflowStep.properties)
    facets.addSource(workflowStep.source)
    workflowStepStore.set(workflowStep.persistentId, workflowStep)
    return workflowStep
  },
  get(): WorkflowStep {
    return getRandomElement(workflowStepStore)
  },
  getById(id: string): WorkflowStep | undefined {
    return workflowStepStore.get(id)
  },
}

const user = {
  clear(): void {
    userStore.clear()
  },
  generate(partial?: Partial<User>): User {
    const _user: User = {
      id: datatype.number(),
      username: internet.userName(),
      displayName: name.findName(),
      status: random.arrayElement(userStatus),
      registrationDate: date.past().toISOString(),
      role: random.arrayElement(userRoles),
      email: internet.email(),
      config: datatype.boolean(),
      ...partial,
    }
    return _user
  },
  create(user: User): User {
    userStore.set(user.id, user)
    return user
  },
  get(): User {
    return getRandomElement(userStore)
  },
  getById(id: number): User | undefined {
    return userStore.get(id)
  },
}

function generateJwt(username: string) {
  return new jwt.UnsecuredJWT({ sub: username }).setIssuedAt().setExpirationTime('24h').encode()
}

interface UserSecret {
  user: User
  password: string
  token: {
    id: string
    registration: string
    access: string
  }
}

const userSecret = {
  clear(): void {
    userSecretStore.clear()
  },
  generate(user: User): UserSecret {
    const username = user.username
    const _userSecret: UserSecret = {
      user,
      password: internet.password(),
      token: {
        id: generateJwt(username),
        registration: generateJwt(username),
        access: generateJwt(username),
      },
    }
    return _userSecret
  },
  create(userSecret: UserSecret): UserSecret {
    userSecretStore.set(userSecret.user.id, userSecret)
    return userSecret
  },
  get(): UserSecret {
    return getRandomElement(userSecretStore)
  },
  getById(userId: number): UserSecret | undefined {
    return userSecretStore.get(userId)
  },
  getByUsername(username: string): UserSecret | undefined {
    return Array.from(userSecretStore.values()).find((userSecret) => {
      return userSecret.user.username === username
    })
  },
  getByIdToken(token: string): UserSecret | undefined {
    return Array.from(userSecretStore.values()).find((userSecret) => {
      return userSecret.token.id === token
    })
  },
  getByRegistrationToken(token: string): UserSecret | undefined {
    return Array.from(userSecretStore.values()).find((userSecret) => {
      return userSecret.token.registration === token
    })
  },
  getByAccessToken(token: string): UserSecret | undefined {
    return Array.from(userSecretStore.values()).find((userSecret) => {
      return userSecret.token.access === token
    })
  },
}

export const db = {
  user,
  userSecret,
  actor,
  actorRole,
  actorSource,
  source,
  vocabulary,
  media,
  propertyType,
  itemSource,
  itemRelation,
  item,
  facets,
  dataset,
  publication,
  tool,
  trainingMaterial,
  workflow,
  workflowStep,
}
