import { HttpError } from '@/api/sshoc'
import { useAuth } from '@/modules/auth/AuthContext'

export function useErrorHandlers(): (error: Error) => void {
  const auth = useAuth()

  function handle(error: Error) {
    if (error instanceof HttpError) {
      switch (error.statusCode) {
        case 401:
        case 403:
          auth.signOut()
          break
      }
    }
  }

  return handle
}
