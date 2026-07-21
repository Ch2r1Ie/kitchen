export type CheckOutInterval = 'DAILY' | 'MONTHLY' | 'YEARLY'

export type CheckOutReq = {
  interval: CheckOutInterval
}

export type CheckOutResp = {
  sessionId: string
  url: string
}
