import { removeToast } from '../actions/toast'
import { REMOVE_TOAST, SHOW_TOAST } from '../constants'

const DEFAULT_TIMEOUT = 2000

const createToastMiddleware = (notifications = {}) => ({
  dispatch,
}) => next => action => {
  if (action.type === SHOW_TOAST) {
    const timestamp = Date.now()

    notifications[timestamp] = setTimeout(() => {
      dispatch(removeToast(timestamp))
    }, action.meta.timeout || DEFAULT_TIMEOUT)

    return next({
      ...action,
      payload: {
        ...action.payload,
        timestamp,
      },
    })
  }

  if (action.type === REMOVE_TOAST) {
    const { timestamp } = action.payload || {}
    const timeout = notifications[timestamp]

    if (timeout) {
      clearTimeout(timeout)
    }
  }

  return next(action)
}

export default createToastMiddleware
