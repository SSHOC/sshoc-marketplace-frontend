export const createPath = (basepath, path) =>
  [basepath, path].join(basepath.endsWith('/') ? '' : '/')
