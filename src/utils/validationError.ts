export class validationError extends Error {
  message: string
  status: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.status = statusCode
    this.message = message

    Error.captureStackTrace(this, this.constructor)
  }
}
