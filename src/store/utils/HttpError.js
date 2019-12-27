export class HttpError extends Error {
  constructor(statusCode, errorMessage, info) {
    super(errorMessage)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.info = info
  }
}
