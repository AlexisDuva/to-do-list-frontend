export interface ApiErrorBody {
  status: number
  error: string
  message: string
  timestamp: string
}

export class ApiError extends Error {
  status: number

  constructor(body: ApiErrorBody) {
    super(body.message)
    this.name = 'ApiError'
    this.status = body.status
  }
}
