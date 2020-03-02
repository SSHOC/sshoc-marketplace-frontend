import createApiMiddleware from './api'
import authMiddleware from './auth'
import errorMiddleware from './error'
import createToastMiddleware from './toast'

const configureMiddleware = ({ fetch, notifications }) => [
  authMiddleware,
  createApiMiddleware(fetch),
  createToastMiddleware(notifications),
  errorMiddleware,
]

export default configureMiddleware
