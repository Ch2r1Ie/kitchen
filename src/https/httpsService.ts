import axios from 'axios'
import { handleError, handleSuccess, requestConfig } from './axiosInterceptors'

const baseURL = process.env.NEXT_PUBLIC_API_URL

export const axiosService = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'content-type': 'application/json',
  },
})

axiosService.interceptors.request.use(requestConfig)
axiosService.interceptors.response.use(handleSuccess, handleError)
