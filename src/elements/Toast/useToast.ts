import { toast } from 'react-toastify'

/**
 * Dispatches a toast notification.
 */
export function useToast(): typeof toast {
  return toast
}

/**
 * Dispatches a toast notification.
 */
export { toast }
