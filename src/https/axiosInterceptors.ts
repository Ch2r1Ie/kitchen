import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ApiError } from '@/src/types/error'
import { axiosService } from './httpsService'
import { clearAccessToken, getAccessToken, setAccessToken } from './tokenStore'

const UNAUTHORIZED_CODE = '1005'

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean
    skipAuthRefresh?: boolean
  }
}

export const requestConfig = async (config: InternalAxiosRequestConfig) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
}

export const handleSuccess = async (response: AxiosResponse) => {
  if (response.data?.code === '0000') {
    return Promise.resolve(response)
  }
  return Promise.reject(
    mapToApiError(
      new AxiosError(
        response.data?.message,
        response.data?.code,
        undefined,
        undefined,
        response,
      ),
    ),
  )
}

let refreshPromise: Promise<string> | null = null

const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = axiosService
      .post('/auth/refresh', undefined, { skipAuthRefresh: true })
      .then((resp) => {
        const token = resp.data.data.accessToken as string
        setAccessToken(token)
        return token
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

export const handleError = async (error: AxiosError) => {
  const apiError = mapToApiError(error)
  const config = error.config

  const isUnauthorized =
    apiError.code === UNAUTHORIZED_CODE || error.response?.status === 401

  if (isUnauthorized && config && !config._retry && !config.skipAuthRefresh) {
    config._retry = true
    try {
      await refreshAccessToken()
      return axiosService(config)
    } catch (refreshErr) {
      clearAccessToken()
      return Promise.reject(mapToApiError(refreshErr as AxiosError))
    }
  }

  if (isUnauthorized && config?.skipAuthRefresh) {
    clearAccessToken()
  }

  return Promise.reject(apiError)
}

const mapToApiError = (error: AxiosError) => {
  const errData = error.response?.data as
    | { result?: { code: string; message: string } }
    | undefined

  const code = errData?.result?.code ?? error.code ?? '500'
  const message = errData?.result?.message ?? error.message

  return new ApiError(code, message, error.response)
}
