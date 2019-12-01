import createApiMiddleware from './api'

const configureMiddleware = ({ fetch }) => [createApiMiddleware(fetch)]

export default configureMiddleware
