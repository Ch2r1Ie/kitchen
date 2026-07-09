"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

type Table = { id: number; status: TableStatus; total: number; elapsed: string };

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

const INITIAL_TABLES: Table[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((id) => {
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

function statusPillStyle(status: OrderStatus): React.CSSProperties {
  const map: Record<OrderStatus, { bg: string; color: string }> = {
    received: { bg: "#f4f4f5", color: "#3f3f46" },
    preparing: { bg: "#fef3c7", color: "#92400e" },
    ready: { bg: "#dcfce7", color: "#15803d" },
    served: { bg: "#f4f4f5", color: "#a1a1aa" },
  };
  const c = map[status];
  return {
    background: c.bg,
    color: c.color,
    fontSize: 12,
    fontWeight: 700,
    borderRadius: 999,
    padding: "4px 10px",
    textTransform: "capitalize",
  };
}

const OverviewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9"></rect>
    <rect x="14" y="3" width="7" height="5"></rect>
    <rect x="14" y="12" width="7" height="9"></rect>
    <rect x="3" y="16" width="7" height="5"></rect>
  </svg>
);
const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);
const QrIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
    <path d="M14 14h3v3h-3zM14 20h1M20 14v1M20 17v3h-3"></path>
  </svg>
);

const NAV_DEFS: { id: View; label: string; Icon: () => React.JSX.Element }[] = [
  { id: "overview", label: "ภาพรวม", Icon: OverviewIcon },
  { id: "menu", label: "เมนู", Icon: MenuIcon },
  { id: "qr", label: "QR โต๊ะ", Icon: QrIcon },
];

export default function Portal() {
  const [view, setView] = useState<View>("overview");
  const [orders] = useState<Order[]>(INITIAL_ORDERS);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
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

  return (
    <div style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif", background: "#fafafa", minHeight: "100vh", color: "#09090b", display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 236, flexShrink: 0, background: "#ffffff", borderRight: "1px solid #e4e4e7", display: "flex", flexDirection: "column", minHeight: "100vh", position: "sticky", top: 0 }}>
        <div style={{ padding: "22px 20px", borderBottom: "1px solid #e4e4e7" }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Baan Baan Kitchen</div>
          <div style={{ fontSize: 12, color: "#71717a", marginTop: 2 }}>พอร์ทัลผู้จัดการ</div>
        </div>

        <div style={{ padding: "14px 12px", display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {NAV_DEFS.map((nav) => {
            const active = nav.id === view;
            return (
              <button
                key={nav.id}
                onClick={() => setView(nav.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  border: "none",
                  background: active ? "#f4f4f5" : "transparent",
                  color: active ? "#09090b" : "#52525b",
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ display: "flex", color: active ? "#09090b" : "#a1a1aa" }}>
                  <nav.Icon />
                </span>
                {nav.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: 16, borderTop: "1px solid #e4e4e7", display: "flex", flexDirection: "column", gap: 8 }}>
          <Link
            href="/scan"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              color: "#09090b",
              padding: "10px 12px",
              borderRadius: 8,
              background: "#f4f4f5",
            }}
          >
            ดูแอปลูกค้า
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto" }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </Link>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {view === "overview" && (
          <div style={{ padding: "28px 32px 60px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>ภาพรวม</div>
            <div style={{ fontSize: 14, color: "#71717a", marginBottom: 24 }}>สรุปผลการดำเนินงานวันนี้</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
              {statCards.map((stat) => (
                <div key={stat.label} style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 12, padding: "18px 20px" }}>
                  <div style={{ fontSize: 13, color: "#71717a", fontWeight: 600 }}>{stat.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 12, padding: "20px 24px", marginBottom: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>ยอดขายสัปดาห์นี้</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 140 }}>
                {WEEK_SALES.map((bar, idx) => {
                  const isToday = idx === WEEK_SALES.length - 1;
                  return (
                    <div key={bar.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}>
                      <div
                        style={{
                          width: "100%",
                          maxWidth: 36,
                          height: `${Math.round((bar.sales / maxSales) * 100)}%`,
                          background: isToday ? "#18181b" : "#e4e4e7",
                          borderRadius: "6px 6px 0 0",
                        }}
                      />
                      <div style={{ fontSize: 11, color: "#71717a", fontWeight: isToday ? 700 : 400 }}>{bar.day}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e4e4e7", fontSize: 14, fontWeight: 700 }}>ออเดอร์ล่าสุด</div>
              {recentOrders.map((o) => (
                <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: "1px solid #f4f4f5", fontSize: 14 }}>
                  <div style={{ fontWeight: 700, width: 56 }}>{o.id}</div>
                  <div style={{ color: "#71717a", width: 70 }}>โต๊ะ {o.table}</div>
                  <div style={{ flex: 1, color: "#71717a" }}>{o.items.map((it) => `${it.qty}× ${it.name}`).join(", ")}</div>
                  <div style={{ fontWeight: 700, width: 70, textAlign: "right" }}>฿{o.total}</div>
                  <div style={{ width: 100, textAlign: "right" }}>
                    <span style={statusPillStyle(o.status)}>{STATUS_LABELS[o.status]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "menu" && (
          <div style={{ padding: "28px 32px 60px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>จัดการเมนู</div>
                <div style={{ fontSize: 14, color: "#71717a" }}>
                  {menuItems.length} รายการ · เปิด/ปิดสถานะ แก้ไขราคา หรือเพิ่มเมนูใหม่
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setShowAddCategory((v) => !v)}
                  style={{ border: "1px solid #e4e4e7", background: "white", color: "#09090b", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  จัดการหมวดหมู่
                </button>
                <button
                  onClick={() => setShowAddItem((v) => !v)}
                  style={{ border: "none", background: "#18181b", color: "white", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  + เพิ่มเมนู
                </button>
              </div>
            </div>

            {showAddCategory && (
              <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>หมวดหมู่ทั้งหมด</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {categories.map((c) => {
                    const count = categoryCounts[c.id] ?? 0;
                    const canRemove = !count;
                    return (
                      <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f4f4f5", borderRadius: 999, padding: "6px 8px 6px 14px", fontSize: 13, fontWeight: 600 }}>
                        {c.name}
                        <span style={{ color: "#a1a1aa", fontWeight: 500 }}>({count})</span>
                        {canRemove && (
                          <button
                            onClick={() => removeCategory(c.id)}
                            style={{ width: 18, height: 18, borderRadius: "50%", border: "none", background: "#e4e4e7", color: "#52525b", cursor: "pointer", fontSize: 11, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    type="text"
                    placeholder="ชื่อหมวดหมู่ใหม่"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    style={{ flex: 1, maxWidth: 240, border: "1px solid #e4e4e7", borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: "inherit" }}
                  />
                  <button
                    onClick={addCategory}
                    style={{ border: "none", background: "#18181b", color: "white", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                  >
                    + เพิ่มหมวดหมู่
                  </button>
                </div>
              </div>
            )}

            {showAddItem && (
              <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 12, padding: "18px 20px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#71717a", marginBottom: 6 }}>ชื่อเมนู</div>
                  <input
                    type="text"
                    placeholder="เช่น แกงเขียวหวาน"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    style={{ width: "100%", border: "1px solid #e4e4e7", borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: "inherit" }}
                  />
                </div>
                <div style={{ width: 130 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#71717a", marginBottom: 6 }}>หมวดหมู่</div>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    style={{ width: "100%", border: "1px solid #e4e4e7", borderRadius: 8, padding: "9px 8px", fontSize: 14, fontFamily: "inherit", background: "white" }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ width: 110 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#71717a", marginBottom: 6 }}>ราคา (฿)</div>
                  <input
                    type="number"
                    placeholder="0"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    style={{ width: "100%", border: "1px solid #e4e4e7", borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: "inherit" }}
                  />
                </div>
                <button
                  onClick={addMenuItem}
                  style={{ border: "none", background: "#18181b", color: "white", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  บันทึก
                </button>
              </div>
            )}

            <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 12, overflow: "hidden" }}>
              {menuItems.map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: "1px solid #f4f4f5" }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 8,
                      background: "repeating-linear-gradient(45deg, #f4f4f5, #f4f4f5 8px, #ececed 8px, #ececed 16px)",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: "#71717a", textTransform: "capitalize" }}>{categoryName(categories, m.category)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 13, color: "#71717a" }}>฿</span>
                    <input
                      type="number"
                      value={m.price}
                      onChange={(e) => setItemPrice(m.id, parseInt(e.target.value, 10) || 0)}
                      style={{ width: 64, border: "1px solid #e4e4e7", borderRadius: 6, padding: "6px 8px", fontSize: 13, fontFamily: "inherit" }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, width: 120 }}>
                    <button
                      onClick={() => toggleItemAvailable(m.id)}
                      style={{
                        width: 38,
                        height: 22,
                        borderRadius: 999,
                        border: "none",
                        background: m.available ? "#18181b" : "#e4e4e7",
                        cursor: "pointer",
                        position: "relative",
                        padding: 0,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: 2,
                          left: m.available ? 18 : 2,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "#ffffff",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
                          transition: "left 0.15s ease",
                        }}
                      />
                    </button>
                    <span style={{ fontSize: 12, fontWeight: 600, color: m.available ? "#15803d" : "#a1a1aa" }}>
                      {m.available ? "พร้อมขาย" : "หมด"}
                    </span>
                  </div>
                  <button onClick={() => deleteItem(m.id)} style={{ border: "none", background: "transparent", color: "#a1a1aa", cursor: "pointer", padding: 6, display: "flex" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                      <path d="M10 11v6M14 11v6"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "qr" && (
          <div style={{ padding: "28px 32px 60px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>QR โต๊ะ</div>
                <div style={{ fontSize: 14, color: "#71717a" }}>{tables.length} โต๊ะ · พิมพ์และวางไว้ที่โต๊ะ หรือใช้สำหรับสั่งกลับบ้าน</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={addTable}
                  style={{ border: "1px solid #e4e4e7", background: "white", color: "#09090b", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  + เพิ่มโต๊ะ
                </button>
                <button
                  onClick={() => window.print()}
                  style={{ border: "none", background: "#18181b", color: "white", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  พิมพ์ทั้งหมด
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 16 }}>
              {qrCodes.map((q) => (
                <div key={q.label} style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 12, padding: 18, textAlign: "center", position: "relative" }}>
                  {q.removable && (
                    <button
                      onClick={q.onRemove}
                      style={{ position: "absolute", top: 10, right: 10, width: 24, height: 24, borderRadius: 6, border: "1px solid #e4e4e7", background: "white", color: "#a1a1aa", cursor: "pointer", fontSize: 13, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      ✕
                    </button>
                  )}
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{q.label}</div>
                  <div
                    style={{
                      width: 150,
                      height: 150,
                      margin: "14px auto 0",
                      background: "repeating-conic-gradient(#18181b 0% 25%, #ffffff 0% 50%) 0 0/20px 20px",
                      border: "6px solid white",
                      boxShadow: "0 0 0 1px #e4e4e7",
                      borderRadius: 8,
                    }}
                  />
                  <div style={{ fontSize: 11, color: "#a1a1aa", marginTop: 12, wordBreak: "break-all" }}>{q.url}</div>
                  <button
                    onClick={() => window.print()}
                    style={{ marginTop: 12, width: "100%", border: "1px solid #e4e4e7", background: "white", borderRadius: 8, padding: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    ดาวน์โหลด
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
