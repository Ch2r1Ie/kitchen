import { LayoutGrid, BarChart3, Menu as MenuIconLucide, QrCode } from "lucide-react";

export type OrderStatus = "received" | "preparing" | "ready" | "served";
export type TableStatus = "empty" | "occupied" | "bill";

export type OrderItem = { name: string; qty: number };
export type Order = {
  id: string;
  table: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  time: string;
};

export type TableRec = { id: number; status: TableStatus; total: number; elapsed: string };

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
};

export type Category = { id: string; name: string };

export type View = "orders" | "sales" | "menu" | "qr";

export const CATEGORIES: Category[] = [
  { id: "appetizers", name: "ของทานเล่น" },
  { id: "noodles", name: "ก๋วยเตี๋ยว" },
  { id: "rice", name: "ข้าว" },
  { id: "grilled", name: "ปิ้งย่าง" },
  { id: "soups", name: "ต้ม" },
  { id: "drinks", name: "เครื่องดื่ม" },
  { id: "desserts", name: "ของหวาน" },
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  received: "รับออเดอร์แล้ว",
  preparing: "กำลังปรุง",
  ready: "พร้อมเสิร์ฟ",
  served: "เสิร์ฟแล้ว",
};

export const INITIAL_TABLES: TableRec[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((id) => {
  if ([5, 3, 8, 1, 10, 6].includes(id)) {
    return { id, status: "occupied" as const, total: 200 + id * 20, elapsed: `${5 + id} min` };
  }
  if (id === 2) return { id, status: "bill" as const, total: 247, elapsed: "22 min" };
  return { id, status: "empty" as const, total: 0, elapsed: "" };
});

export const INITIAL_MENU: MenuItem[] = [
  { id: "padthai", name: "Pad Thai", category: "noodles", price: 129, available: true },
  { id: "padseeew", name: "Pad See Ew", category: "noodles", price: 119, available: true },
  { id: "boatnoodle", name: "Boat Noodles", category: "noodles", price: 69, available: true },
  { id: "khaopad", name: "Thai Fried Rice", category: "rice", price: 109, available: true },
  { id: "khaomangai", name: "Khao Man Gai", category: "rice", price: 99, available: true },
  { id: "basilrice", name: "Basil Fried Rice", category: "rice", price: 109, available: false },
  { id: "moopin", name: "Grilled Pork Skewers", category: "grilled", price: 59, available: true },
  { id: "satay", name: "Chicken Satay", category: "grilled", price: 89, available: true },
  { id: "tomyum", name: "Tom Yum Goong", category: "soups", price: 149, available: true },
  { id: "thaitea", name: "Thai Iced Tea", category: "drinks", price: 49, available: true },
  { id: "mangosticky", name: "Mango Sticky Rice", category: "desserts", price: 99, available: true },
];

export const WEEK_SALES = [
  { day: "จ", sales: 8200 },
  { day: "อ", sales: 9400 },
  { day: "พ", sales: 7600 },
  { day: "พฤ", sales: 10200 },
  { day: "ศ", sales: 12800 },
  { day: "ส", sales: 15600 },
  { day: "อา", sales: 13200 },
];

export function categoryName(list: Category[], id: string) {
  return list.find((c) => c.id === id)?.name ?? id;
}

export function statusBadgeClass(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    received: "bg-muted text-foreground/70",
    preparing: "bg-amber-100 text-amber-800",
    ready: "bg-green-100 text-green-700",
    served: "bg-muted text-muted-foreground",
  };
  return map[status];
}

export const NAV_DEFS: { id: View; href: string; label: string; Icon: typeof LayoutGrid }[] = [
  { id: "orders", href: "/portal/orders", label: "ออเดอร์ล่าสุด", Icon: LayoutGrid },
  { id: "sales", href: "/portal/sales", label: "สรุปยอดขาย", Icon: BarChart3 },
  { id: "menu", href: "/portal/menu", label: "เมนู", Icon: MenuIconLucide },
  { id: "qr", href: "/portal/qr", label: "QR โต๊ะ", Icon: QrCode },
];

export const VIEW_TITLES: Record<View, string> = {
  orders: "ออเดอร์ล่าสุด",
  sales: "สรุปยอดขาย",
  menu: "จัดการเมนู",
  qr: "QR โต๊ะ",
};
