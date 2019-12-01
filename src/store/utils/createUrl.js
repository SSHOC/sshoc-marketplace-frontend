export const createUrl = ({ baseUrl, path, query = {} }) => {
  const searchParams = new URLSearchParams()

  const add = (key, value) => {
    if (value != null) {
      searchParams.append(key, value)
    }
  }

  Object.entries(query).forEach(([key, value]) =>
    Array.isArray(value)
      ? value.forEach(item => add(key, item))
      : add(key, value)
  )

  searchParams.sort()
  const queryString = searchParams.toString()

  return [baseUrl, path, queryString ? `?${queryString}` : ''].join('')
}
