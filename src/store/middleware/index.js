import createApiMiddleware from './api'
import authMiddleware from './auth'

const configureMiddleware = ({ fetch }) => [
  authMiddleware,
  createApiMiddleware(fetch),
]

export default configureMiddleware
