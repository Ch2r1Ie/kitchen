const DEFAULT_COOKIE_DAYS = 30

export const setCookie = (name: string, value: string) => {
  const expires = new Date(
    Date.now() + DEFAULT_COOKIE_DAYS * 864e5,
  ).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; secure; samesite=strict`
}

export const getCookie = (name: string): string | undefined => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='))
    ?.split('=')
    .slice(1)
    .join('=')
  return cookie ? decodeURIComponent(cookie) : undefined
}

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=strict`
}
