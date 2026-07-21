const ACCESS_TOKEN_KEY = 'accessToken'

export const getAccessToken = () => {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export const setAccessToken = (token: string) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const clearAccessToken = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
}
