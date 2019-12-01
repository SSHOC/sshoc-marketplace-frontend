export class HttpError extends Error {
  constructor(response) {
    super(response.statusText)
    this.name = 'HttpError'
    this.response = response
  }
}
