export const createNormalizer = ({
  field,
  resourceType = 'items',
  // some resources have `code` instead of `id`
  idKey = 'id',
}) => data => {
  // single resource // TODO: This is a bit weird
  if (!field) {
    return {
      entities: { [resourceType]: [data[idKey]] },
      resources: { [resourceType]: { [data[idKey]]: data } },
    }
  }

  const { [field]: collection, ...info } = data

  const entities = []
  const resources = collection.reduce((acc, resource) => {
    const id = resource[idKey]
    entities.push(id)
    acc[id] = resource
    return acc
  }, {})

  return {
    entities: { [resourceType]: entities },
    resources: { [resourceType]: resources },
    info,
  }
}
