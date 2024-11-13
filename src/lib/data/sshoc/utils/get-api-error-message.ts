import { HttpError } from '@stefanprobst/request'

export async function getApiErrorMessage(error: unknown): Promise<string> {
  if (!(error instanceof Error)) return 'Unknown error'

  if (error instanceof HttpError) {
    if (error.response.headers.get('content-type') === 'application/json') {
      const message = await error.response.json()
      if (typeof message === 'string') {
        return message
      }
      if ('error' in message) {
        if (typeof message.error === 'string') return message.error
        if (typeof message.error?.message === 'string') return message.error.message
      }
      if ('errors' in message) {
        if (typeof message.errors[0] === 'string') return message.errors[0]
        if (typeof message.errors[0]?.message === 'string') return message.errors[0].message
      }
    }
  }

  return error.message || 'Unknown error'
}
