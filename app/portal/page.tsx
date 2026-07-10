"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  LayoutGrid,
  Menu as MenuIconLucide,
  Printer,
  QrCode,
  Trash2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  sidebarMenuButtonVariants,
} from "@/components/ui/sidebar";

type OrderStatus = "received" | "preparing" | "ready" | "served";
type TableStatus = "empty" | "occupied" | "bill";

type OrderItem = { name: string; qty: number };
type Order = {
  id: string;
  table: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  time: string;
};

type TableRec = { id: number; status: TableStatus; total: number; elapsed: string };

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
};

type Category = { id: string; name: string };

type View = "overview" | "menu" | "qr";

const CATEGORIES: Category[] = [
  { id: "appetizers", name: "ของทานเล่น" },
  { id: "noodles", name: "ก๋วยเตี๋ยว" },
  { id: "rice", name: "ข้าว" },
  { id: "grilled", name: "ปิ้งย่าง" },
  { id: "soups", name: "ต้ม" },
  { id: "drinks", name: "เครื่องดื่ม" },
  { id: "desserts", name: "ของหวาน" },
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: "รับออเดอร์แล้ว",
  preparing: "กำลังปรุง",
  ready: "พร้อมเสิร์ฟ",
  served: "เสิร์ฟแล้ว",
};

const INITIAL_ORDERS: Order[] = [
  { id: "A214", table: 5, items: [{ name: "Pad Thai", qty: 2 }, { name: "Thai Iced Tea", qty: 2 }], total: 356, status: "received", time: "1 min ago" },
  { id: "A213", table: 3, items: [{ name: "Tom Yum Goong", qty: 1 }, { name: "Thai Fried Rice", qty: 1 }], total: 258, status: "received", time: "2 min ago" },
  { id: "A211", table: 8, items: [{ name: "Basil Fried Rice", qty: 2 }], total: 218, status: "preparing", time: "5 min ago" },
  { id: "A209", table: 1, items: [{ name: "Papaya Salad", qty: 1 }, { name: "Grilled Squid", qty: 1 }], total: 258, status: "preparing", time: "7 min ago" },
  { id: "A207", table: 10, items: [{ name: "Khao Man Gai", qty: 2 }], total: 198, status: "ready", time: "9 min ago" },
  { id: "A205", table: 6, items: [{ name: "Boat Noodles", qty: 3 }], total: 207, status: "ready", time: "11 min ago" },
  { id: "A202", table: 2, items: [{ name: "Mango Sticky Rice", qty: 2 }, { name: "Thai Iced Tea", qty: 1 }], total: 247, status: "served", time: "18 min ago" },
  { id: "A200", table: 5, items: [{ name: "Pad See Ew", qty: 1 }], total: 119, status: "served", time: "25 min ago" },
];

const INITIAL_TABLES: TableRec[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((id) => {
  if ([5, 3, 8, 1, 10, 6].includes(id)) {
    return { id, status: "occupied" as const, total: 200 + id * 20, elapsed: `${5 + id} min` };
  }
  if (id === 2) return { id, status: "bill" as const, total: 247, elapsed: "22 min" };
  return { id, status: "empty" as const, total: 0, elapsed: "" };
});

const INITIAL_MENU: MenuItem[] = [
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

const WEEK_SALES = [
  { day: "จ", sales: 8200 },
  { day: "อ", sales: 9400 },
  { day: "พ", sales: 7600 },
  { day: "พฤ", sales: 10200 },
  { day: "ศ", sales: 12800 },
  { day: "ส", sales: 15600 },
  { day: "อา", sales: 13200 },
];

function categoryName(list: Category[], id: string) {
  return list.find((c) => c.id === id)?.name ?? id;
}

function statusBadgeClass(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    received: "bg-muted text-foreground/70",
    preparing: "bg-amber-100 text-amber-800",
    ready: "bg-green-100 text-green-700",
    served: "bg-muted text-muted-foreground",
  };
  return map[status];
}

const NAV_DEFS: { id: View; label: string; Icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "ภาพรวม", Icon: LayoutGrid },
  { id: "menu", label: "เมนู", Icon: MenuIconLucide },
  { id: "qr", label: "QR โต๊ะ", Icon: QrCode },
];

export default function Portal() {
  const [view, setView] = useState<View>("overview");
  const [orders] = useState<Order[]>(INITIAL_ORDERS);
  const [tables, setTables] = useState<TableRec[]>(INITIAL_TABLES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("noodles");
  const [newItemPrice, setNewItemPrice] = useState("");

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const todaysSales = orders.reduce((sum, o) => sum + o.total, 0);
  const ordersToday = orders.length;
  const activeTableCount = tables.filter((t) => t.status !== "empty").length;
  const avgOrderValue = ordersToday ? Math.round(todaysSales / ordersToday) : 0;

  const statCards = [
    { label: "ยอดขายวันนี้", value: `฿${todaysSales.toLocaleString()}` },
    { label: "ออเดอร์วันนี้", value: String(ordersToday) },
    { label: "โต๊ะที่ใช้งาน", value: `${activeTableCount} / ${tables.length}` },
    { label: "ค่าเฉลี่ยต่อออเดอร์", value: `฿${avgOrderValue}` },
  ];

  const maxSales = Math.max(...WEEK_SALES.map((d) => d.sales));
  const recentOrders = [...orders].slice(-6).reverse();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    menuItems.forEach((m) => {
      counts[m.category] = (counts[m.category] ?? 0) + 1;
    });
    return counts;
  }, [menuItems]);

  function addMenuItem() {
    const name = newItemName.trim();
    if (!name) return;
    const price = parseInt(newItemPrice, 10) || 0;
    const item: MenuItem = {
      id: `${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      name,
      category: newItemCategory,
      price,
      available: true,
    };
    setMenuItems((prev) => [item, ...prev]);
    setShowAddItem(false);
    setNewItemName("");
    setNewItemPrice("");
  }

  function setItemPrice(id: string, price: number) {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, price } : m)));
  }

  function toggleItemAvailable(id: string) {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m)));
  }

  function deleteItem(id: string) {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  }

  function addCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;
    setCategories((prev) => [...prev, { id, name }]);
    setNewCategoryName("");
    setShowAddCategory(false);
  }

  function removeCategory(id: string) {
    if (categoryCounts[id]) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function addTable() {
    setTables((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((t) => t.id)) + 1 : 1;
      return [...prev, { id: nextId, status: "empty", total: 0, elapsed: "" }];
    });
  }

  function removeTable(id: number) {
    setTables((prev) => prev.filter((t) => t.id !== id));
  }

  const qrCodes = [
    ...tables.map((t) => ({
      label: `โต๊ะ ${t.id}`,
      url: `baanbaankitchen.co.th/table/${t.id}`,
      removable: true,
      onRemove: () => removeTable(t.id),
    })),
    { label: "สั่งกลับบ้าน", url: "baanbaankitchen.co.th/takeaway", removable: false, onRemove: () => {} },
  ];

  const viewTitles: Record<View, string> = {
    overview: "ภาพรวม",
    menu: "จัดการเมนู",
    qr: "QR โต๊ะ",
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-3">
          <div className="px-1.5 py-1">
            <div className="text-base font-extrabold">Baan Baan Kitchen</div>
            <div className="mt-0.5 text-xs text-muted-foreground">พอร์ทัลผู้จัดการ</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {NAV_DEFS.map((nav) => (
                <SidebarMenuItem key={nav.id}>
                  <SidebarMenuButton
                    isActive={nav.id === view}
                    tooltip={nav.label}
                    onClick={() => setView(nav.id)}
                  >
                    <nav.Icon />
                    <span>{nav.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/scan" className={sidebarMenuButtonVariants()}>
                <span>ดูแอปลูกค้า</span>
                <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground" />
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{viewTitles[view]}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {view === "overview" && (
          <div className="px-8 pt-7 pb-15">
            <div className="mb-0.5 text-[22px] font-extrabold">ภาพรวม</div>
            <div className="mb-6 text-sm text-muted-foreground">สรุปผลการดำเนินงานวันนี้</div>

            <div className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              {statCards.map((stat) => (
                <Card key={stat.label} className="gap-2 px-5 py-4.5">
                  <div className="text-[13px] font-semibold text-muted-foreground">{stat.label}</div>
                  <div className="text-[26px] font-extrabold">{stat.value}</div>
                </Card>
              ))}
            </div>

            <Card className="mb-7 px-6 py-5">
              <div className="mb-4.5 text-sm font-bold">ยอดขายสัปดาห์นี้</div>
              <div className="flex h-35 items-end gap-3.5">
                {WEEK_SALES.map((bar, idx) => {
                  const isToday = idx === WEEK_SALES.length - 1;
                  return (
                    <div key={bar.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                      <div
                        className={cn("w-full max-w-9 rounded-t-md", isToday ? "bg-primary" : "bg-border")}
                        style={{ height: `${Math.round((bar.sales / maxSales) * 100)}%` }}
                      />
                      <div className={cn("text-[11px]", isToday ? "font-bold text-foreground" : "text-muted-foreground")}>{bar.day}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="gap-0 overflow-hidden py-0">
              <div className="border-b border-border px-5 py-4 text-sm font-bold">ออเดอร์ล่าสุด</div>
              <Table>
                <TableBody>
                  {recentOrders.map((o) => (
                    <TableRow key={o.id} className="hover:bg-transparent">
                      <TableCell className="w-14 py-3.5 pl-5 font-bold">{o.id}</TableCell>
                      <TableCell className="w-18 text-muted-foreground">โต๊ะ {o.table}</TableCell>
                      <TableCell className="text-muted-foreground">{o.items.map((it) => `${it.qty}× ${it.name}`).join(", ")}</TableCell>
                      <TableCell className="text-right font-bold">฿{o.total}</TableCell>
                      <TableCell className="pr-5 text-right">
                        <Badge className={cn("h-auto rounded-full px-2.5 py-1 font-bold", statusBadgeClass(o.status))}>
                          {STATUS_LABELS[o.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {view === "menu" && (
          <div className="px-8 pt-7 pb-15">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="mb-0.5 text-[22px] font-extrabold">จัดการเมนู</div>
                <div className="text-sm text-muted-foreground">
                  {menuItems.length} รายการ · เปิด/ปิดสถานะ แก้ไขราคา หรือเพิ่มเมนูใหม่
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddCategory((v) => !v)}>
                  จัดการหมวดหมู่
                </Button>
                <Button onClick={() => setShowAddItem((v) => !v)}>+ เพิ่มเมนู</Button>
              </div>
            </div>

            {showAddCategory && (
              <Card className="mb-5 px-5 py-4.5">
                <div className="mb-3 text-[13px] font-bold">หมวดหมู่ทั้งหมด</div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const count = categoryCounts[c.id] ?? 0;
                    const canRemove = !count;
                    return (
                      <Badge key={c.id} variant="secondary" className="h-auto gap-1.5 rounded-full py-1.5 pr-1.5 pl-3.5 text-[13px] font-semibold">
                        {c.name}
                        <span className="font-medium text-muted-foreground">({count})</span>
                        {canRemove && (
                          <button
                            onClick={() => removeCategory(c.id)}
                            className="flex size-4.5 items-center justify-center rounded-full bg-border text-[11px] text-foreground/70"
                          >
                            <X className="size-2.5" />
                          </button>
                        )}
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex gap-2.5">
                  <Input
                    type="text"
                    placeholder="ชื่อหมวดหมู่ใหม่"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="h-auto max-w-60 py-2.25"
                  />
                  <Button onClick={addCategory}>+ เพิ่มหมวดหมู่</Button>
                </div>
              </Card>
            )}

            {showAddItem && (
              <Card className="mb-5 flex-row flex-wrap items-end gap-3 px-5 py-4.5">
                <div className="min-w-40 flex-1">
                  <div className="mb-1.5 text-xs font-semibold text-muted-foreground">ชื่อเมนู</div>
                  <Input
                    type="text"
                    placeholder="เช่น แกงเขียวหวาน"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="h-auto py-2.25"
                  />
                </div>
                <div className="w-32.5">
                  <div className="mb-1.5 text-xs font-semibold text-muted-foreground">หมวดหมู่</div>
                  <Select
                    value={newItemCategory}
                    onValueChange={(value) => value && setNewItemCategory(value)}
                  >
                    <SelectTrigger className="h-auto w-full py-2.25">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-27.5">
                  <div className="mb-1.5 text-xs font-semibold text-muted-foreground">ราคา (฿)</div>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="h-auto py-2.25"
                  />
                </div>
                <Button onClick={addMenuItem}>บันทึก</Button>
              </Card>
            )}

            <Card className="gap-0 overflow-hidden py-0">
              <Table>
                <TableHeader className="sr-only">
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((m) => (
                    <TableRow key={m.id} className="hover:bg-transparent">
                      <TableCell className="w-16 py-3.5 pl-5">
                        <div className="size-13 rounded-lg bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_8px,var(--border)_8px,var(--border)_16px)]" />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-semibold">{m.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">{categoryName(categories, m.category)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-[13px] text-muted-foreground">฿</span>
                          <Input
                            type="number"
                            value={m.price}
                            onChange={(e) => setItemPrice(m.id, parseInt(e.target.value, 10) || 0)}
                            className="h-auto w-16 py-1.5 text-[13px]"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="w-30">
                        <div className="flex items-center gap-2">
                          <Switch checked={m.available} onCheckedChange={() => toggleItemAvailable(m.id)} />
                          <span className={cn("text-xs font-semibold", m.available ? "text-green-700" : "text-muted-foreground")}>
                            {m.available ? "พร้อมขาย" : "หมด"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="w-12 pr-5">
                        <Button variant="ghost" size="icon-sm" onClick={() => deleteItem(m.id)}>
                          <Trash2 className="size-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {view === "qr" && (
          <div className="px-8 pt-7 pb-15">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="mb-0.5 text-[22px] font-extrabold">QR โต๊ะ</div>
                <div className="text-sm text-muted-foreground">{tables.length} โต๊ะ · พิมพ์และวางไว้ที่โต๊ะ หรือใช้สำหรับสั่งกลับบ้าน</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={addTable}>
                  + เพิ่มโต๊ะ
                </Button>
                <Button onClick={() => window.print()}>
                  <Printer className="size-4" />
                  พิมพ์ทั้งหมด
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
              {qrCodes.map((q) => (
                <Card key={q.label} className="relative gap-0 p-4.5 text-center">
                  {q.removable && (
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="absolute top-2.5 right-2.5 text-muted-foreground"
                      onClick={q.onRemove}
                    >
                      <X className="size-3.5" />
                    </Button>
                  )}
                  <div className="text-sm font-bold">{q.label}</div>
                  <div className="mx-auto mt-3.5 size-37.5 rounded-lg border-6 border-background bg-[repeating-conic-gradient(var(--primary)_0%_25%,var(--background)_0%_50%)] bg-size-[20px_20px] shadow-[0_0_0_1px_var(--border)]" />
                  <div className="mt-3 text-[11px] break-all text-muted-foreground">{q.url}</div>
                  <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => window.print()}>
                    ดาวน์โหลด
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
