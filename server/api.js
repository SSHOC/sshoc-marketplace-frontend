const { Router } = require('express')
const db = require('./db.json')

const api = Router()

const DEFAULT_PAGE_SIZE = 20

const ITEM_CATEGORIES = {
  ALL: ['dataset', 'tool', 'training-material'],
  DATASETS: ['dataset'],
  TOOLS: ['tool'],
  TRAINING_MATERIALS: ['training-material'],
}

const asc = field => (a, b) => a[field] > b[field]
const desc = field => (a, b) => a[field] < b[field]

const SORT_FIELDS = {
  score: {
    compare: asc('id'), // we don't have match score, so sort by id
  },
  name: {
    compare: asc('label'),
  },
  'modified-on': {
    compare: desc('lastInfoUpdate'),
  },
}

const getAll = arr => (Array.isArray(arr) ? arr : arr && [arr])

api.get('/item-search', (req, res) => {
  const { categories: _categories = [], q = '', order } = req.query

  if (
    !getAll(_categories).every(category =>
      ITEM_CATEGORIES.ALL.includes(category)
    )
  ) {
    return res.status(400).send('Bad request: invalid category')
  }

  const categories = getAll(req.query.categories) || ITEM_CATEGORIES.ALL

  const perpage = parseInt(req.query.perpage, 10) || DEFAULT_PAGE_SIZE
  const page = parseInt(req.query.page, 10) || 1

  const searchTerms = q.toLowerCase().split(/\s+/)

  const allResults = Object.values(db).filter(
    item =>
      searchTerms.every(
        searchTerm =>
          item.label.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm)
      ) && categories.includes(item.category)
  )

  const results = allResults.slice((page - 1) * perpage, page * perpage)

  if (order) {
    if (!Object.keys(SORT_FIELDS).includes(order)) {
      return res.status(400).send('Bad request: invalid sort field')
    }
    results.sort(SORT_FIELDS[order].compare)
  }

  const resultsByCategory = allResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = {
        count: 0,
      }
    }
    acc[result.category].count++
    return acc
  }, {})

  res.send({
    hits: allResults.length,
    count: results.length,
    perpage,
    page,
    pages: Math.ceil(allResults.length / perpage),
    items: results,
    categories: resultsByCategory,
  })
})

api.get('/datasets', (req, res) => {
  const perpage = parseInt(req.query.perpage, 10) || DEFAULT_PAGE_SIZE
  const page = parseInt(req.query.page, 10) || 1

  const allDatasets = Object.values(db).filter(item =>
    ITEM_CATEGORIES.DATASETS.includes(item.category)
  )

  const datasets = allDatasets.slice((page - 1) * perpage, page * perpage)

  res.send({
    hits: allDatasets.length,
    count: datasets.length,
    perpage,
    page,
    pages: Math.ceil(allDatasets.length / perpage),
    datasets,
  })
})

api.get('/datasets/:id', (req, res) => {
  const id = req.params.id

  const item = db[id]

  if (!item || !ITEM_CATEGORIES.DATASETS.includes(item.category)) {
    return res.status(404).send('Not found')
  }

  return res.send(item)
})

api.get('/tools', (req, res) => {
  const perpage = parseInt(req.query.perpage, 10) || DEFAULT_PAGE_SIZE
  const page = parseInt(req.query.page, 10) || 1

  const allTools = Object.values(db).filter(item =>
    ITEM_CATEGORIES.TOOLS.includes(item.category)
  )

  const tools = allTools.slice((page - 1) * perpage, page * perpage)

  res.send({
    hits: allTools.length,
    count: tools.length,
    perpage,
    page,
    pages: Math.ceil(allTools.length / perpage),
    tools,
  })
})

api.get('/tools/:id', (req, res) => {
  const id = req.params.id

  const item = db[id]

  if (!item || !ITEM_CATEGORIES.TOOLS.includes(item.category)) {
    return res.status(404).send('Not found')
  }

  return res.send(item)
})

api.get('/training-materials', (req, res) => {
  const perpage = parseInt(req.query.perpage, 10) || DEFAULT_PAGE_SIZE
  const page = parseInt(req.query.page, 10) || 1

  const allTrainingMaterials = Object.values(db).filter(item =>
    ITEM_CATEGORIES.TRAINING_MATERIALS.includes(item.category)
  )

  const trainingMaterials = allTrainingMaterials.slice(
    (page - 1) * perpage,
    page * perpage
  )

  return res.send({
    hits: allTrainingMaterials.length,
    count: trainingMaterials.length,
    perpage,
    page,
    pages: Math.ceil(allTrainingMaterials.length / perpage),
    trainingMaterials,
  })
})

api.get('/training-materials/:id', (req, res) => {
  const id = req.params.id

  const item = db[id]

  if (!item || !ITEM_CATEGORIES.TRAINING_MATERIALS.includes(item.category)) {
    return res.status(404).send('Not found')
  }

  return res.send(item)
})

module.exports = api
