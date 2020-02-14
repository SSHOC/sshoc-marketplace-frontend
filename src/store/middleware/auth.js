import { API_REQUEST } from '../constants'

const authMiddleware = ({ getState }) => next => action => {
  if (action.type !== API_REQUEST) {
    return next(action)
  }

  if (!action.meta?.requiresAuthentication) {
    return next(action)
  }

  const { token } = getState().user

  // TODO: handle missing token

  const headers = {
    ...action.payload.headers,
    Authorization: `Bearer ${token}`,
  }

  return next({
    ...action,
    payload: {
      ...action.payload,
      headers,
    },
  })
}

export default authMiddleware
