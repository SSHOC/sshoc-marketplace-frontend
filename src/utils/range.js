export const range = (length, start = 0) =>
  Array.from(Array(length).keys(), n => n + start)
