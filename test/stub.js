const transformer = {
  process() {
    return 'module.exports = {};'
  },
  getCacheKey() {
    return 'stub'
  },
}

module.exports = transformer
