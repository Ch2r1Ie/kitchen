import {
  LayoutGrid,
  BarChart3,
  Menu as MenuIconLucide,
  QrCode,
  CreditCard,
} from 'lucide-react'

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'served'
export type TableStatus = 'empty' | 'occupied' | 'bill'

export type OrderItem = { name: string; nameTh: string; qty: number }
export type Order = {
  id: string
  table: number
  items: OrderItem[]
  total: number
  status: OrderStatus
  time: string
  createdAt: string
}

export type TableRec = {
  id: number
  status: TableStatus
  total: number
  elapsed: string
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
  available: boolean
}

export type Category = { id: number; name: string; nameTh: string }

export type View = 'orders' | 'sales' | 'menu' | 'qr' | 'subscribe'

export const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'รับออเดอร์แล้ว',
  preparing: 'กำลังปรุง',
  ready: 'พร้อมเสิร์ฟ',
  served: 'เสิร์ฟแล้ว',
}

export const INITIAL_TABLES: TableRec[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
].map((id) => {
  if ([5, 3, 8, 1, 10, 6].includes(id)) {
    return {
      id,
      status: 'occupied' as const,
      total: 200 + id * 20,
      elapsed: `${5 + id} min`,
    }
  }
  if (id === 2)
    return { id, status: 'bill' as const, total: 247, elapsed: '22 min' }
  return { id, status: 'empty' as const, total: 0, elapsed: '' }
})

export const WEEK_SALES = [
  { day: 'จ', sales: 8200 },
  { day: 'อ', sales: 9400 },
  { day: 'พ', sales: 7600 },
  { day: 'พฤ', sales: 10200 },
  { day: 'ศ', sales: 12800 },
  { day: 'ส', sales: 15600 },
  { day: 'อา', sales: 13200 },
]

export const MONTH_SALES = [
  { day: 'ม.ค.', sales: 218000 },
  { day: 'ก.พ.', sales: 196000 },
  { day: 'มี.ค.', sales: 231000 },
  { day: 'เม.ย.', sales: 254000 },
  { day: 'พ.ค.', sales: 209000 },
  { day: 'มิ.ย.', sales: 267000 },
  { day: 'ก.ค.', sales: 285000 },
  { day: 'ส.ค.', sales: 241000 },
  { day: 'ก.ย.', sales: 223000 },
  { day: 'ต.ค.', sales: 259000 },
  { day: 'พ.ย.', sales: 276000 },
  { day: 'ธ.ค.', sales: 312000 },
]

export const YEAR_SALES = [
  { day: '2564', sales: 1850000 },
  { day: '2565', sales: 2120000 },
  { day: '2566', sales: 2430000 },
  { day: '2567', sales: 2680000 },
  { day: '2568', sales: 2910000 },
  { day: '2569', sales: 1420000 },
]

export function categoryName(list: Category[], id: number) {
  return list.find((c) => c.id === id)?.nameTh ?? String(id)
}

export function statusBadgeClass(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    received: 'bg-muted text-foreground/70',
    preparing: 'bg-amber-100 text-amber-800',
    ready: 'bg-green-100 text-green-700',
    served: 'bg-muted text-muted-foreground',
  }
  return map[status]
}

export const NAV_DEFS: {
  id: View
  href: string
  label: string
  Icon: typeof LayoutGrid
}[] = [
  {
    id: 'orders',
    href: '/portal/orders',
    label: 'ออเดอร์ล่าสุด',
    Icon: LayoutGrid,
  },
  { id: 'sales', href: '/portal/sales', label: 'สรุปยอดขาย', Icon: BarChart3 },
  { id: 'menu', href: '/portal/menu', label: 'เมนู', Icon: MenuIconLucide },
  { id: 'qr', href: '/portal/qr', label: 'QR โต๊ะ', Icon: QrCode },
  {
    id: 'subscribe',
    href: '/portal/subscribe',
    label: 'สมัครสมาชิก',
    Icon: CreditCard,
  },
]

export const VIEW_TITLES: Record<View, string> = {
  orders: 'ออเดอร์ล่าสุด',
  sales: 'สรุปยอดขาย',
  menu: 'จัดการเมนู',
  qr: 'QR โต๊ะ',
  subscribe: 'สมัครสมาชิก',
}
