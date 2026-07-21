export type MonthlyStat = {
  month: string
  totalAmount: number
  totalOrders: number
}

export type GetStatsResp = {
  totalAmount: number
  totalOrders: number
  totalRestaurants: number
  monthly: MonthlyStat[]
}
