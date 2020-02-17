const pattern = new Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export const formatDate = str => {
  try {
    return pattern.format(new Date(str))
  } catch (error) {
    return 'Invalid date'
  }
}
