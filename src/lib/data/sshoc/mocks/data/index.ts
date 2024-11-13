import { db } from '@/data/sshoc/mocks/data/db'
import { times } from '@/lib/utils'

function createUsers() {
  const USER_COUNT = 5

  const administrator = db.user.create(db.user.generate({ role: 'administrator' }))
  db.userSecret.create(db.userSecret.generate(administrator))
  const moderator = db.user.create(db.user.generate({ role: 'moderator' }))
  db.userSecret.create(db.userSecret.generate(moderator))

  times(USER_COUNT).forEach(() => {
    const user = db.user.create(db.user.generate())
    db.userSecret.create(db.userSecret.generate(user))
  })
}

function createSources() {
  const SOURCE_COUNT = 10

  times(SOURCE_COUNT).forEach(() => {
    db.source.create(db.source.generate())
  })
}

function createActorSources() {
  const ACTOR_SOURCE_COUNT = 10

  times(ACTOR_SOURCE_COUNT).forEach(() => {
    db.actorSource.create(db.actorSource.generate())
  })
}

function createActorRoles() {
  const ACTOR_ROLE_COUNT = 5

  times(ACTOR_ROLE_COUNT).forEach(() => {
    db.actorRole.create(db.actorRole.generate())
  })
}

function createActors() {
  const ACTOR_COUNT = 20

  times(ACTOR_COUNT).forEach(() => {
    db.actor.create(db.actor.generate())
  })
}

function createVocabularies() {
  const VOCABULARY_COUNT = 10

  times(VOCABULARY_COUNT).forEach(() => {
    db.vocabulary.create(db.vocabulary.generate())
  })
}

function createPropertyTypes() {
  const PROPERTY_TYPE_COUNT = 20

  db.propertyType.create({
    ...db.propertyType.generate(),
    code: 'activity',
    label: 'Activity',
    type: 'concept',
    hidden: false,
    allowedVocabularies: [db.vocabulary.get()],
  })
  db.propertyType.create({
    ...db.propertyType.generate(),
    code: 'keyword',
    label: 'Keyword',
    type: 'concept',
    hidden: false,
    allowedVocabularies: [db.vocabulary.get()],
  })

  times(PROPERTY_TYPE_COUNT).forEach(() => {
    db.propertyType.create(db.propertyType.generate())
  })
}

function createMedia() {
  const MEDIA_COUNT = 20

  times(MEDIA_COUNT).forEach(() => {
    db.media.create(db.media.generate())
  })
}

function createItemSources() {
  const ITEM_SOURCE_COUNT = 10

  times(ITEM_SOURCE_COUNT).forEach(() => {
    db.itemSource.create(db.itemSource.generate())
  })
}

function createItems() {
  const ITEM_COUNT_PER_ITEM_CATEGORY = 20

  const kinds = ['dataset', 'publication', 'tool', 'trainingMaterial', 'workflow'] as const

  times(ITEM_COUNT_PER_ITEM_CATEGORY).forEach(() => {
    kinds.forEach((kind) => {
      const model = db[kind]
      /* @ts-expect-error Conflicting item category. */
      model.create(model.generate())
    })
  })
}

export function seedDatabase(): void {
  createUsers()
  createSources()
  createActorSources()
  createActorRoles()
  createActors()
  createVocabularies()
  createPropertyTypes()
  createMedia()
  createItemSources()
  createItems()
}

export function clearDatabase(): void {
  db.user.clear()
  db.userSecret.clear()
  db.source.clear()
  db.actorSource.clear()
  db.actorRole.clear()
  db.actor.clear()
  db.vocabulary.clear()
  db.propertyType.clear()
  db.media.clear()
  db.itemSource.clear()
  db.item.clear()
  db.dataset.clear()
  db.publication.clear()
  db.tool.clear()
  db.trainingMaterial.clear()
  db.workflow.clear()
  db.workflowStep.clear()
}
