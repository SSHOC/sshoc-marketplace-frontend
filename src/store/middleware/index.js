import createApiMiddleware from './api'
import authMiddleware from './auth'
import errorMiddleware from './error'

const configureMiddleware = ({ fetch }) => [
  authMiddleware,
  createApiMiddleware(fetch),
  errorMiddleware,
]

export default configureMiddleware
