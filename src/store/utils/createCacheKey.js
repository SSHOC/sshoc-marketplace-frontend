export const createCacheKey = ({ method = 'get', name, query }) => {
  const keys = Object.keys(query)
  keys.sort()
  const sorted = keys.reduce((acc, key) => {
    acc[key] = query[key]
    return acc
  }, {})

  return [name, method.toUpperCase(), JSON.stringify(sorted)].join('::')
}
