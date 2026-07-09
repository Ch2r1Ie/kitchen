"use client";

import { useEffect, useRef, useState } from "react";

type OrderType = "dine-in" | "takeaway";
type Screen = "landing" | "menu" | "tracking";
type PaymentMethod = "promptpay" | "card" | "cash";
type OrderStatus = "received" | "preparing" | "ready" | "served";

type Category = { id: string; name: string; nameTh: string };

type MenuDef = {
  id: string;
  category: string;
  name: string;
  nameTh: string;
  desc: string;
  price: number;
  spicy: boolean;
  chili?: number;
};

type CartLine = { key: string; id: string; name: string; basePrice: number; qty: number };

const CATEGORIES: Category[] = [
  { id: "appetizers", name: "Appetizers", nameTh: "ของทานเล่น" },
  { id: "noodles", name: "Noodles", nameTh: "ก๋วยเตี๋ยว" },
  { id: "rice", name: "Rice", nameTh: "ข้าว" },
  { id: "grilled", name: "Grilled & BBQ", nameTh: "ปิ้งย่าง" },
  { id: "soups", name: "Soups", nameTh: "ต้ม" },
  { id: "drinks", name: "Drinks", nameTh: "เครื่องดื่ม" },
  { id: "desserts", name: "Desserts", nameTh: "ของหวาน" },
];

const MENU: MenuDef[] = [
  { id: "spring_roll", category: "appetizers", name: "Fresh Spring Rolls", nameTh: "ปอเปี๊ยะสด", desc: "Rice paper rolls with herbs, shrimp & peanut sauce", price: 89, spicy: false },
  { id: "wonton", category: "appetizers", name: "Fried Wontons", nameTh: "เกี๊ยวทอด", desc: "Crispy pork wontons, sweet chili sauce", price: 79, spicy: false },
  { id: "somtum", category: "appetizers", name: "Papaya Salad", nameTh: "ส้มตำ", desc: "Green papaya, tomato, peanut, lime, chili", price: 99, spicy: true, chili: 3 },
  { id: "padthai", category: "noodles", name: "Pad Thai", nameTh: "ผัดไทย", desc: "Stir-fried rice noodles, shrimp, tofu, egg, peanuts", price: 129, spicy: true, chili: 1 },
  { id: "padseeew", category: "noodles", name: "Pad See Ew", nameTh: "ผัดซีอิ๊ว", desc: "Wide rice noodles, Chinese broccoli, dark soy", price: 119, spicy: false },
  { id: "boatnoodle", category: "noodles", name: "Boat Noodles", nameTh: "ก๋วยเตี๋ยวเรือ", desc: "Rich pork broth, herbs, blood tofu", price: 69, spicy: true, chili: 2 },
  { id: "khaopad", category: "rice", name: "Thai Fried Rice", nameTh: "ข้าวผัด", desc: "Jasmine rice, egg, onion, choice of protein", price: 109, spicy: false },
  { id: "khaomangai", category: "rice", name: "Khao Man Gai", nameTh: "ข้าวมันไก่", desc: "Hainanese chicken rice, ginger-soy sauce", price: 99, spicy: false },
  { id: "basilrice", category: "rice", name: "Basil Fried Rice", nameTh: "ข้าวผัดกะเพรา", desc: "Holy basil, chili, garlic, fried egg on top", price: 109, spicy: true, chili: 2 },
  { id: "moopin", category: "grilled", name: "Grilled Pork Skewers", nameTh: "หมูปิ้ง", desc: "Marinated pork skewers, charcoal grilled (5 pcs)", price: 59, spicy: false },
  { id: "satay", category: "grilled", name: "Chicken Satay", nameTh: "สะเต๊ะไก่", desc: "Grilled chicken skewers, peanut sauce (5 pcs)", price: 89, spicy: false },
  { id: "grilledsquid", category: "grilled", name: "Grilled Squid", nameTh: "ปลาหมึกย่าง", desc: "Whole squid, seafood dipping sauce", price: 159, spicy: true, chili: 1 },
  { id: "tomyum", category: "soups", name: "Tom Yum Goong", nameTh: "ต้มยำกุ้ง", desc: "Hot & sour prawn soup, lemongrass, chili", price: 149, spicy: true, chili: 3 },
  { id: "tomkha", category: "soups", name: "Tom Kha Gai", nameTh: "ต้มข่าไก่", desc: "Coconut galangal soup with chicken", price: 119, spicy: true, chili: 1 },
  { id: "thaitea", category: "drinks", name: "Thai Iced Tea", nameTh: "ชาไทย", desc: "Sweet milk tea over ice", price: 49, spicy: false },
  { id: "limesoda", category: "drinks", name: "Fresh Lime Soda", nameTh: "โซดามะนาว", desc: "Soda, fresh lime, a touch of salt", price: 45, spicy: false },
  { id: "coconut", category: "drinks", name: "Coconut Water", nameTh: "น้ำมะพร้าว", desc: "Young coconut, served in the shell", price: 59, spicy: false },
  { id: "mangosticky", category: "desserts", name: "Mango Sticky Rice", nameTh: "ข้าวเหนียวมะม่วง", desc: "Sweet sticky rice, coconut cream, ripe mango", price: 99, spicy: false },
  { id: "coconuticecream", category: "desserts", name: "Coconut Ice Cream", nameTh: "ไอศกรีมกะทิ", desc: "Coconut ice cream, roasted peanuts, sticky rice", price: 69, spicy: false },
];

const STATUS_STEPS: OrderStatus[] = ["received", "preparing", "ready", "served"];

const C = {
  border: "#e4e4e7",
  text: "#09090b",
  muted: "#71717a",
  primary: "#18181b",
};

function tabStyle(active: boolean): React.CSSProperties {
  return {
    background: "transparent",
    color: active ? C.text : C.muted,
    border: "none",
    borderBottom: active ? `2px solid ${C.text}` : "2px solid transparent",
    borderRadius: 0,
    padding: "12px 2px",
    fontSize: 14,
    fontWeight: active ? 600 : 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  };
}

function chip(active: boolean): React.CSSProperties {
  return {
    background: active ? C.primary : "#ffffff",
    color: active ? "white" : C.text,
    border: `1px solid ${active ? C.primary : C.border}`,
    borderRadius: 8,
    padding: "9px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  };
}

function toggleBtn(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    textAlign: "center",
    background: active ? "white" : "transparent",
    color: active ? C.text : C.muted,
    border: "none",
    borderRadius: 6,
    padding: "9px 0",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
  };
}

function stepDot(status: "done" | "active" | "upcoming"): React.CSSProperties {
  const base: React.CSSProperties = { width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "white" };
  if (status === "done") return { ...base, background: C.primary };
  if (status === "active") return { ...base, background: C.primary };
  return { ...base, background: "#f4f4f5", color: C.muted, border: `1px solid ${C.border}` };
}

const bilingual = true;

export default function ScanToOrder() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [showCart, setShowCart] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [phone, setPhone] = useState("");
  const [activeCategory, setActiveCategory] = useState("noodles");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [lastCart, setLastCart] = useState<CartLine[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("promptpay");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("received");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const phoneInvalid = phone.replace(/\D/g, "").length < 9;

  function goToMenu() {
    if (!phoneInvalid) {
      setScreen("menu");
      setShowCart(false);
    }
  }

  function incItemQty(item: MenuDef) {
    setCart((prev) => {
      const existing = prev.find((l) => l.key === item.id);
      if (existing) {
        return prev.map((l) => (l.key === item.id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { key: item.id, id: item.id, name: item.name, basePrice: item.price, qty: 1 }];
    });
  }

  function decItemQty(item: MenuDef) {
    setCart((prev) => prev.map((l) => (l.key === item.id ? { ...l, qty: l.qty - 1 } : l)).filter((l) => l.qty > 0));
  }

  function updateCartQty(key: string, delta: number) {
    setCart((prev) => prev.map((l) => (l.key === key ? { ...l, qty: Math.max(0, l.qty + delta) } : l)).filter((l) => l.qty > 0));
  }

  function removeCartLine(key: string) {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }

  function placeOrder() {
    if (cart.length === 0) return;
    const num = "A" + Math.floor(100 + Math.random() * 900);
    setOrderNumber(num);
    setOrderStatus("received");
    setLastCart(cart);
    setCart([]);
    setShowCart(false);
    setScreen("tracking");

    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [
      setTimeout(() => setOrderStatus("preparing"), 4000),
      setTimeout(() => setOrderStatus("ready"), 10000),
      setTimeout(() => setOrderStatus("served"), 16000),
    ];
  }

  function newOrder() {
    timers.current.forEach((t) => clearTimeout(t));
    setScreen("menu");
    setOrderNumber(null);
    setOrderStatus("received");
    setLastCart([]);
  }

  const cartQtyById: Record<string, number> = {};
  cart.forEach((l) => {
    cartQtyById[l.id] = l.qty;
  });

  const filteredItems = MENU.filter((i) => i.category === activeCategory);

  const cartCount = cart.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = cart.reduce((sum, l) => sum + l.basePrice * l.qty, 0);
  const vat = Math.round(subtotal * 0.07);
  const total = subtotal + vat;
  const cartIsEmpty = cart.length === 0;

  const trackingLines = lastCart.map((l) => ({ ...l, lineTotal: l.basePrice * l.qty }));
  const trackingSubtotal = trackingLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const trackingVat = Math.round(trackingSubtotal * 0.07);
  const trackingTotal = trackingSubtotal + trackingVat;

  const statusLabels: Record<OrderStatus, string> = {
    received: "Order Received",
    preparing: "Preparing",
    ready: orderType === "takeaway" ? "Ready for Pickup" : "Ready to Serve",
    served: orderType === "takeaway" ? "Picked Up" : "Served",
  };
  const currentIdx = STATUS_STEPS.indexOf(orderStatus);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fafafa", minHeight: "100vh", color: "#09090b", position: "relative" }}>
      {screen === "landing" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", textAlign: "center", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div>
              <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>Baan Baan Kitchen</div>
              {bilingual && <div style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: 22, color: "#71717a", marginTop: 6 }}>บ้าน บ้าน คิทเช่น</div>}
            </div>
            <div style={{ fontSize: 20, color: "#52525b", maxWidth: 360, lineHeight: 1.5 }}>
              Scan · Order · Enjoy
              {bilingual && <div style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: 21, marginTop: 3 }}>สแกน สั่ง อิ่มอร่อย</div>}
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f4f4f5", borderRadius: 999, padding: "7px 14px", marginTop: 4, fontSize: 13, fontWeight: 600, color: "#09090b" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Table 12 · Ready to order
            </div>
          </div>

          <div style={{ width: "100%", maxWidth: 340, textAlign: "left", marginTop: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
              Mobile Number
              {bilingual && <span style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 400, color: "#71717a" }}> · เบอร์โทรศัพท์</span>}
            </div>
            <input
              type="tel"
              inputMode="tel"
              placeholder="08X-XXX-XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "100%", border: "1.5px solid #e4e4e7", borderRadius: 12, padding: "18px 18px", fontSize: 19, fontFamily: "inherit", background: "#ffffff", color: "inherit" }}
            />
          </div>

          <button
            onClick={goToMenu}
            disabled={phoneInvalid}
            style={{
              marginTop: 8,
              background: phoneInvalid ? "#f4f4f5" : "#18181b",
              color: phoneInvalid ? "#a1a1aa" : "white",
              border: "none",
              borderRadius: 12,
              padding: "19px 40px",
              fontSize: 19,
              fontWeight: 700,
              cursor: phoneInvalid ? "not-allowed" : "pointer",
              boxShadow: phoneInvalid ? "none" : "0 1px 2px rgba(0,0,0,0.15)",
              width: "100%",
              maxWidth: 340,
            }}
          >
            View Menu
            {bilingual && <span style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 500, marginLeft: 6 }}>· ดูเมนู</span>}
          </button>
        </div>
      )}

      {screen === "menu" && (
        <div style={{ minHeight: "100vh", paddingBottom: 60 }}>
          <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#ffffff", borderBottom: "1px solid #e4e4e7", padding: "14px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#18181b", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>Baan Baan Kitchen</div>
                <div style={{ fontSize: 12, color: "#71717a", textTransform: "capitalize" }}>Table 12 · {orderType}</div>
              </div>
            </div>
            <button
              onClick={() => setShowCart((v) => !v)}
              style={{ position: "relative", border: "1px solid #e4e4e7", background: "#18181b", color: "white", borderRadius: 8, width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -6, right: -6, background: "#dc2626", borderRadius: 999, minWidth: 18, height: 18, padding: "0 4px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fafafa" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div style={{ display: "flex", gap: 20, padding: "0 20px", overflowX: "auto", borderBottom: "1px solid #e4e4e7", background: "#ffffff" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={tabStyle(cat.id === activeCategory)}>
                {cat.name}
                {bilingual && <span style={{ fontFamily: "'Noto Sans Thai', sans-serif", marginLeft: 4 }}>{cat.nameTh}</span>}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "18px 20px 40px" }}>
            {filteredItems.map((item) => {
              const qty = cartQtyById[item.id] || 0;
              return (
                <div key={item.id} style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 10, padding: 12, display: "flex", gap: 14, alignItems: "stretch" }}>
                  <div style={{ width: 112, height: 112, flexShrink: 0, borderRadius: 8, background: "repeating-linear-gradient(45deg, #f4f4f5, #f4f4f5 10px, #ececed 10px, #ececed 20px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 10, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "center", padding: 6 }}>
                    {item.name} photo
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 4 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</div>
                        {item.spicy && (
                          <div style={{ display: "flex", gap: 2, flexShrink: 0, marginTop: 4 }}>
                            {Array.from({ length: item.chili || 1 }).map((_, i) => (
                              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#dc2626" }} />
                            ))}
                          </div>
                        )}
                      </div>
                      {bilingual && <div style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: 12, color: "#71717a" }}>{item.nameTh}</div>}
                      <div style={{ fontSize: 13, color: "#71717a", lineHeight: 1.4, marginTop: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.desc}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>฿{item.price}</div>
                      {qty > 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <button onClick={() => decItemQty(item)} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid #e4e4e7", background: "white", fontSize: 15, cursor: "pointer" }}>
                            −
                          </button>
                          <div style={{ fontSize: 14, fontWeight: 700, minWidth: 14, textAlign: "center" }}>{qty}</div>
                          <button onClick={() => incItemQty(item)} style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: "#18181b", color: "white", fontSize: 15, cursor: "pointer" }}>
                            +
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => incItemQty(item)} style={{ border: "none", background: "#18181b", color: "white", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {screen === "tracking" && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
          <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 12, maxWidth: 560, width: "100%", padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em" }}>Order Number</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 4 }}>{orderNumber}</div>
              <div style={{ fontSize: 13, color: "#71717a", marginTop: 6, textTransform: "capitalize" }}>{orderType} · Table 12</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {STATUS_STEPS.map((id, idx) => {
                const status = idx < currentIdx ? "done" : idx === currentIdx ? "active" : "upcoming";
                return (
                  <div key={id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                    <div style={stepDot(status)}>{status === "done" ? "✓" : String(idx + 1)}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, textAlign: "center", color: status === "upcoming" ? C.muted : C.text }}>{statusLabels[id]}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#71717a" }}>Order Summary</div>
              {trackingLines.map((tl) => (
                <div key={tl.key} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <div>
                    {tl.qty}× {tl.name}
                  </div>
                  <div style={{ fontWeight: 600 }}>฿{tl.lineTotal}</div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, borderTop: "1px solid #e4e4e7", paddingTop: 10, marginTop: 4 }}>
                <div>Total Paid</div>
                <div>฿{trackingTotal}</div>
              </div>
            </div>

            <button onClick={newOrder} style={{ border: "none", background: "#18181b", color: "white", borderRadius: 10, padding: 14, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Order More Items
            </button>
          </div>
        </div>
      )}

      {showCart && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 90 }} onClick={() => setShowCart(false)} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 100%)", background: "#ffffff", zIndex: 95, display: "flex", flexDirection: "column", boxShadow: "-8px 0 30px rgba(0,0,0,0.12)", borderLeft: "1px solid #e4e4e7" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #e4e4e7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>
                Your Order {bilingual && <span style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 500, fontSize: 13, color: "#71717a" }}>· ออเดอร์ของคุณ</span>}
              </div>
              <button onClick={() => setShowCart(false)} style={{ border: "1px solid #e4e4e7", background: "white", borderRadius: 8, width: 30, height: 30, fontSize: 14, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {cartIsEmpty && (
                <div style={{ textAlign: "center", padding: "40px 10px", color: "#71717a", fontSize: 14 }}>
                  Your cart is empty
                  <br />
                  ตะกร้าว่างเปล่า
                </div>
              )}
              {cart.map((line) => (
                <div key={line.key} style={{ display: "flex", gap: 12, paddingBottom: 14, borderBottom: "1px solid #f4f4f5" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{line.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                      <button onClick={() => updateCartQty(line.key, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #e4e4e7", background: "white", fontSize: 13, cursor: "pointer" }}>
                        −
                      </button>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{line.qty}</div>
                      <button onClick={() => updateCartQty(line.key, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #e4e4e7", background: "white", fontSize: 13, cursor: "pointer" }}>
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>฿{line.basePrice * line.qty}</div>
                    <button onClick={() => removeCartLine(line.key)} style={{ border: "none", background: "transparent", color: "#dc2626", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "18px 20px", borderTop: "1px solid #e4e4e7", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", background: "#f4f4f5", borderRadius: 8, padding: 4, gap: 4 }}>
                <button onClick={() => setOrderType("dine-in")} style={toggleBtn(orderType === "dine-in")}>
                  Dine-in
                </button>
                <button onClick={() => setOrderType("takeaway")} style={toggleBtn(orderType === "takeaway")}>
                  Takeaway
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#71717a" }}>
                <div>Subtotal</div>
                <div>฿{subtotal}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#71717a" }}>
                <div>VAT (7%)</div>
                <div>฿{vat}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
                <div>Total</div>
                <div>฿{total}</div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setPaymentMethod("promptpay")} style={chip(paymentMethod === "promptpay")}>
                  PromptPay QR
                </button>
                <button onClick={() => setPaymentMethod("card")} style={chip(paymentMethod === "card")}>
                  Card
                </button>
                <button onClick={() => setPaymentMethod("cash")} style={chip(paymentMethod === "cash")}>
                  Cash
                </button>
              </div>

              <button
                onClick={placeOrder}
                disabled={cartIsEmpty}
                style={{
                  border: "none",
                  background: cartIsEmpty ? "#f4f4f5" : C.primary,
                  color: cartIsEmpty ? C.muted : "white",
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: cartIsEmpty ? "not-allowed" : "pointer",
                }}
              >
                Place Order · ฿{total}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
