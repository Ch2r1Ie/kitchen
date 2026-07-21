export type Restaurant = {
  id: string
  name: string
  nameTh: string
}

export type Category = {
  id: number
  name: string
}

export type MenuItem = {
  id: number
  image: string
  category: number
  name: string
  nameTh: string
  desc: string
  price: number
  spicy: boolean
}

export type ScanQRResp = {
  restaurant: Restaurant
  categories: Category[]
  menu: MenuItem[]
}

export type OrderItemReq = {
  menuId: number
  qty: number
}

export type CreateOrderReq = {
  items: OrderItemReq[]
  orderType: string
  paymentMethod: string
}

export type CreateOrderResp = {
  orderNumber: string
  tableNumber: number
  paymentStatus: string
  total: number
}
