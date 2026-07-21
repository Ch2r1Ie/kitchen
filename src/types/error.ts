import { AxiosResponse } from 'axios'

export class ApiError extends Error {
  code: string
  response?: AxiosResponse

  constructor(code: string, message: string, response?: AxiosResponse) {
    super(message)
    this.code = code
    this.response = response
  }
}
