import { NOTIFICATION_LEVEL, REMOVE_TOAST, SHOW_TOAST } from '../constants'

export const showToast = (
  message,
  level = NOTIFICATION_LEVEL.INFO,
  timeout
) => ({
  type: SHOW_TOAST,
  payload: {
    level,
    message,
  },
  meta: {
    timeout,
  },
})

export const removeToast = timestamp => ({
  type: REMOVE_TOAST,
  payload: {
    timestamp,
  },
})
