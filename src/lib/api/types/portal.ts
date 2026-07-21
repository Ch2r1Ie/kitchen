export type GetSummaryReq = {
  from: string
  to: string
}

export type TopMenuSeller = {
  name: string
  qty: number
}

export type DailyAvg = {
  day: string
  avgTotal: number
}

export type GetSummaryResp = {
  totalAmount: number
  topMenuSeller: TopMenuSeller | null
  dailyAvgOrders: DailyAvg[]
}

export type GetOrdersReq = {
  page: number
  pageSize: number
}

export type OrderCardItem = {
  name: string
  qty: number
  nameTh: string
}

export type OrderCard = {
  id: string
  table: number
  items: OrderCardItem[]
  total: number
  status: string
  time: string
}

export type AddCategoryReq = {
  name: string
}

export type AddCategoryResp = {
  id: number
  name: string
}

export type DeleteCategoryReq = {
  categoryId: number
}

export type AddMenuReq = {
  name: string
  price: number
  category: number
}

export type AddMenuResp = {
  id: number
  name: string
  price: number
  category: number
}

export type GetMenusByCategoryReq = {
  category: number
}

export type MenuItem = {
  id: number
  name: string
  nameTh: string
  description: string
  imageUrl: string
  price: number
  isSpicy: boolean
  isAvailable: boolean
}

export type UpdateMenuAvailabilityReq = {
  menuId: number
  isAvailable: boolean
}

export type DeleteMenuReq = {
  menuId: number
}
