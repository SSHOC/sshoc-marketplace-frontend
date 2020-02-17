export const createCacheKey = ({ name, query = {} }) => {
  const keys = Object.keys(query)
  keys.sort()
  const sorted = keys.reduce((acc, key) => {
    acc[key] = query[key]
    return acc
  }, {})

  return [name, JSON.stringify(sorted)].join('::')
}
