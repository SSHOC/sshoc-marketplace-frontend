export const createNormalizer = ({ field, resourceType = 'items' }) => data => {
  // single resource // TODO: This is a bit weird
  if (!field) {
    return {
      entities: { [resourceType]: [data.id] },
      resources: { [resourceType]: { [data.id]: data } },
    }
  }

  const { [field]: collection, ...info } = data

  const entities = []
  const resources = collection.reduce((acc, resource) => {
    entities.push(resource.id)
    acc[resource.id] = resource
    return acc
  }, {})

  return {
    entities: { [resourceType]: entities },
    resources: { [resourceType]: resources },
    info,
  }
}
