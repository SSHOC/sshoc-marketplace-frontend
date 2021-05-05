export class MediaError extends Error {
  name = 'MediaError'

  constructor(message: string) {
    super(message)
  }
}
