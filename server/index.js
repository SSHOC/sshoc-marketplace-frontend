const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const PORT = 8080

const app = express()

app.use(cors())
app.use(morgan('tiny'))

app.get('/api', (req, res) => {
  res.send({
    message: 'Nothing to see yet',
  })
})

app.use((req, res, next) => {
  res.status(404).send('Not found')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
})

app.listen(PORT, () => {
  console.log(`Mock server listening on port ${PORT}.`)
})
