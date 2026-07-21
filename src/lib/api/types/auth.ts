export type AuthenReq = {
  authCode: string
}

export type AuthResponse = {
  accessToken: string
  expiredAt: number
}
