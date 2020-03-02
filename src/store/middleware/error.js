import { showToast } from '../actions/toast'

const errorMiddleware = ({ dispatch }) => next => action => {
  next(action)

  if (action.error && action.meta?.notification !== false) {
    dispatch(showToast(String(action.payload) || 'Unknown error'))
    console.error(action.payload)
  }
}

export default errorMiddleware
