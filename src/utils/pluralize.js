export const pluralize = str =>
  str.endsWith('y') ? str.slice(0, str.length - 1) + 'ies' : str + 's'
