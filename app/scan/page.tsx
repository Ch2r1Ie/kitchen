'use client'

import { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import {
  Camera,
  Check,
  Minus,
  Plus,
  QrCode,
  ShoppingCart,
  Trash2,
} from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

type OrderType = 'dine-in' | 'takeaway'
type Screen = 'landing' | 'menu' | 'tracking'
type PaymentMethod = 'promptpay' | 'card' | 'cash'
type OrderStatus = 'received' | 'preparing' | 'ready' | 'served'

type Category = { id: string; name: string; nameTh: string }

type MenuDef = {
  id: string
  category: string
  name: string
  nameTh: string
  desc: string
  price: number
  spicy: boolean
}

type CartLine = {
  key: string
  id: string
  name: string
  basePrice: number
  qty: number
}

const CATEGORIES: Category[] = [
  { id: 'appetizers', name: 'Appetizers', nameTh: 'ของทานเล่น' },
  { id: 'noodles', name: 'Noodles', nameTh: 'ก๋วยเตี๋ยว' },
  { id: 'rice', name: 'Rice', nameTh: 'ข้าว' },
  { id: 'grilled', name: 'Grilled & BBQ', nameTh: 'ปิ้งย่าง' },
  { id: 'soups', name: 'Soups', nameTh: 'ต้ม' },
  { id: 'drinks', name: 'Drinks', nameTh: 'เครื่องดื่ม' },
  { id: 'desserts', name: 'Desserts', nameTh: 'ของหวาน' },
]

const MENU: MenuDef[] = [
  {
    id: 'spring_roll',
    category: 'appetizers',
    name: 'Fresh Spring Rolls',
    nameTh: 'ปอเปี๊ยะสด',
    desc: 'Rice paper rolls with herbs, shrimp & peanut sauce',
    price: 89,
    spicy: false,
  },
  {
    id: 'wonton',
    category: 'appetizers',
    name: 'Fried Wontons',
    nameTh: 'เกี๊ยวทอด',
    desc: 'Crispy pork wontons, sweet chili sauce',
    price: 79,
    spicy: false,
  },
  {
    id: 'somtum',
    category: 'appetizers',
    name: 'Papaya Salad',
    nameTh: 'ส้มตำ',
    desc: 'Green papaya, tomato, peanut, lime, chili',
    price: 99,
    spicy: true,
  },
  {
    id: 'padthai',
    category: 'noodles',
    name: 'Pad Thai',
    nameTh: 'ผัดไทย',
    desc: 'Stir-fried rice noodles, shrimp, tofu, egg, peanuts',
    price: 129,
    spicy: true,
  },
  {
    id: 'padseeew',
    category: 'noodles',
    name: 'Pad See Ew',
    nameTh: 'ผัดซีอิ๊ว',
    desc: 'Wide rice noodles, Chinese broccoli, dark soy',
    price: 119,
    spicy: false,
  },
  {
    id: 'boatnoodle',
    category: 'noodles',
    name: 'Boat Noodles',
    nameTh: 'ก๋วยเตี๋ยวเรือ',
    desc: 'Rich pork broth, herbs, blood tofu',
    price: 69,
    spicy: true,
  },
  {
    id: 'khaopad',
    category: 'rice',
    name: 'Thai Fried Rice',
    nameTh: 'ข้าวผัด',
    desc: 'Jasmine rice, egg, onion, choice of protein',
    price: 109,
    spicy: false,
  },
  {
    id: 'khaomangai',
    category: 'rice',
    name: 'Khao Man Gai',
    nameTh: 'ข้าวมันไก่',
    desc: 'Hainanese chicken rice, ginger-soy sauce',
    price: 99,
    spicy: false,
  },
  {
    id: 'basilrice',
    category: 'rice',
    name: 'Basil Fried Rice',
    nameTh: 'ข้าวผัดกะเพรา',
    desc: 'Holy basil, chili, garlic, fried egg on top',
    price: 109,
    spicy: true,
  },
  {
    id: 'moopin',
    category: 'grilled',
    name: 'Grilled Pork Skewers',
    nameTh: 'หมูปิ้ง',
    desc: 'Marinated pork skewers, charcoal grilled (5 pcs)',
    price: 59,
    spicy: false,
  },
  {
    id: 'satay',
    category: 'grilled',
    name: 'Chicken Satay',
    nameTh: 'สะเต๊ะไก่',
    desc: 'Grilled chicken skewers, peanut sauce (5 pcs)',
    price: 89,
    spicy: false,
  },
  {
    id: 'grilledsquid',
    category: 'grilled',
    name: 'Grilled Squid',
    nameTh: 'ปลาหมึกย่าง',
    desc: 'Whole squid, seafood dipping sauce',
    price: 159,
    spicy: true,
  },
  {
    id: 'tomyum',
    category: 'soups',
    name: 'Tom Yum Goong',
    nameTh: 'ต้มยำกุ้ง',
    desc: 'Hot & sour prawn soup, lemongrass, chili',
    price: 149,
    spicy: true,
  },
  {
    id: 'tomkha',
    category: 'soups',
    name: 'Tom Kha Gai',
    nameTh: 'ต้มข่าไก่',
    desc: 'Coconut galangal soup with chicken',
    price: 119,
    spicy: true,
  },
  {
    id: 'thaitea',
    category: 'drinks',
    name: 'Thai Iced Tea',
    nameTh: 'ชาไทย',
    desc: 'Sweet milk tea over ice',
    price: 49,
    spicy: false,
  },
  {
    id: 'limesoda',
    category: 'drinks',
    name: 'Fresh Lime Soda',
    nameTh: 'โซดามะนาว',
    desc: 'Soda, fresh lime, a touch of salt',
    price: 45,
    spicy: false,
  },
  {
    id: 'coconut',
    category: 'drinks',
    name: 'Coconut Water',
    nameTh: 'น้ำมะพร้าว',
    desc: 'Young coconut, served in the shell',
    price: 59,
    spicy: false,
  },
  {
    id: 'mangosticky',
    category: 'desserts',
    name: 'Mango Sticky Rice',
    nameTh: 'ข้าวเหนียวมะม่วง',
    desc: 'Sweet sticky rice, coconut cream, ripe mango',
    price: 99,
    spicy: false,
  },
  {
    id: 'coconuticecream',
    category: 'desserts',
    name: 'Coconut Ice Cream',
    nameTh: 'ไอศกรีมกะทิ',
    desc: 'Coconut ice cream, roasted peanuts, sticky rice',
    price: 69,
    spicy: false,
  },

  // Appetizers
  {
    id: 'fishcake',
    category: 'appetizers',
    name: 'Thai Fish Cakes',
    nameTh: 'ทอดมันปลา',
    desc: 'Curried fish cakes served with cucumber relish',
    price: 99,
    spicy: true,
  },
  {
    id: 'shrimpcake',
    category: 'appetizers',
    name: 'Shrimp Cakes',
    nameTh: 'ทอดมันกุ้ง',
    desc: 'Golden fried shrimp cakes with plum sauce',
    price: 129,
    spicy: false,
  },
  {
    id: 'larbmoo',
    category: 'appetizers',
    name: 'Larb Moo',
    nameTh: 'ลาบหมู',
    desc: 'Minced pork salad with herbs, lime and toasted rice',
    price: 109,
    spicy: true,
  },
  {
    id: 'yumwoonsen',
    category: 'appetizers',
    name: 'Glass Noodle Salad',
    nameTh: 'ยำวุ้นเส้น',
    desc: 'Glass noodles with shrimp, pork and spicy lime dressing',
    price: 119,
    spicy: true,
  },

  // Noodles
  {
    id: 'drunkennoodles',
    category: 'noodles',
    name: 'Drunken Noodles',
    nameTh: 'ผัดขี้เมา',
    desc: 'Spicy stir-fried flat noodles with holy basil',
    price: 129,
    spicy: true,
  },
  {
    id: 'radna',
    category: 'noodles',
    name: 'Rad Na',
    nameTh: 'ราดหน้า',
    desc: 'Wide noodles with pork and Chinese broccoli in gravy',
    price: 119,
    spicy: false,
  },
  {
    id: 'yentafo',
    category: 'noodles',
    name: 'Yen Ta Fo',
    nameTh: 'เย็นตาโฟ',
    desc: 'Pink noodle soup with seafood and tofu',
    price: 109,
    spicy: true,
  },
  {
    id: 'suukhothainoodle',
    category: 'noodles',
    name: 'Sukhothai Noodles',
    nameTh: 'ก๋วยเตี๋ยวสุโขทัย',
    desc: 'Sweet, sour and spicy pork noodle soup',
    price: 99,
    spicy: true,
  },

  // Rice
  {
    id: 'krapaomoo',
    category: 'rice',
    name: 'Holy Basil Pork',
    nameTh: 'ผัดกะเพราหมู',
    desc: 'Stir-fried minced pork with holy basil and fried egg',
    price: 119,
    spicy: true,
  },
  {
    id: 'garlicrice',
    category: 'rice',
    name: 'Garlic Pork Rice',
    nameTh: 'ข้าวหมูกระเทียม',
    desc: 'Garlic pepper pork served over jasmine rice',
    price: 109,
    spicy: false,
  },
  {
    id: 'greenchickencurry',
    category: 'rice',
    name: 'Green Curry Chicken',
    nameTh: 'แกงเขียวหวานไก่',
    desc: 'Green curry with chicken, eggplant and jasmine rice',
    price: 139,
    spicy: true,
  },
  {
    id: 'massamancurry',
    category: 'rice',
    name: 'Massaman Beef Curry',
    nameTh: 'แกงมัสมั่นเนื้อ',
    desc: 'Rich curry with beef, potatoes and peanuts',
    price: 159,
    spicy: true,
  },

  // Grilled
  {
    id: 'grilledchicken',
    category: 'grilled',
    name: 'Thai Grilled Chicken',
    nameTh: 'ไก่ย่าง',
    desc: 'Marinated grilled chicken with spicy dipping sauce',
    price: 139,
    spicy: true,
  },
  {
    id: 'korib',
    category: 'grilled',
    name: 'Grilled Pork Neck',
    nameTh: 'คอหมูย่าง',
    desc: 'Charcoal grilled pork neck with jaew sauce',
    price: 149,
    spicy: true,
  },
  {
    id: 'grilledprawns',
    category: 'grilled',
    name: 'Grilled River Prawns',
    nameTh: 'กุ้งแม่น้ำเผา',
    desc: 'Large river prawns with seafood sauce',
    price: 299,
    spicy: true,
  },

  // Soups
  {
    id: 'gaengjued',
    category: 'soups',
    name: 'Clear Tofu Soup',
    nameTh: 'แกงจืดเต้าหู้',
    desc: 'Clear broth with tofu, pork and vegetables',
    price: 99,
    spicy: false,
  },
  {
    id: 'tomsaap',
    category: 'soups',
    name: 'Tom Saap Pork Ribs',
    nameTh: 'ต้มแซ่บกระดูกอ่อน',
    desc: 'Hot and sour pork rib soup with herbs',
    price: 149,
    spicy: true,
  },
  {
    id: 'kaengsom',
    category: 'soups',
    name: 'Sour Curry Soup',
    nameTh: 'แกงส้ม',
    desc: 'Traditional sour curry with vegetables and shrimp',
    price: 139,
    spicy: true,
  },

  // Drinks
  {
    id: 'greentea',
    category: 'drinks',
    name: 'Thai Green Milk Tea',
    nameTh: 'ชาเขียวนม',
    desc: 'Sweet Thai green tea with milk',
    price: 49,
    spicy: false,
  },
  {
    id: 'lemontea',
    category: 'drinks',
    name: 'Lemon Iced Tea',
    nameTh: 'ชามะนาว',
    desc: 'Fresh brewed black tea with lemon',
    price: 45,
    spicy: false,
  },
  {
    id: 'roselle',
    category: 'drinks',
    name: 'Roselle Juice',
    nameTh: 'น้ำกระเจี๊ยบ',
    desc: 'Refreshing homemade roselle drink',
    price: 40,
    spicy: false,
  },
  {
    id: 'butterflypea',
    category: 'drinks',
    name: 'Butterfly Pea Lime',
    nameTh: 'อัญชันมะนาว',
    desc: 'Butterfly pea flower drink with fresh lime',
    price: 45,
    spicy: false,
  },

  // Desserts
  {
    id: 'lodchong',
    category: 'desserts',
    name: 'Lod Chong',
    nameTh: 'ลอดช่อง',
    desc: 'Pandan noodles in coconut milk with ice',
    price: 59,
    spicy: false,
  },
  {
    id: 'tubtimkrob',
    category: 'desserts',
    name: 'Tub Tim Grob',
    nameTh: 'ทับทิมกรอบ',
    desc: 'Water chestnuts in coconut milk with crushed ice',
    price: 69,
    spicy: false,
  },
  {
    id: 'bananafritter',
    category: 'desserts',
    name: 'Fried Banana',
    nameTh: 'กล้วยทอด',
    desc: 'Crispy fried bananas with sesame',
    price: 59,
    spicy: false,
  },
  {
    id: 'kanomkrok',
    category: 'desserts',
    name: 'Coconut Pancakes',
    nameTh: 'ขนมครก',
    desc: 'Traditional coconut rice pancakes',
    price: 49,
    spicy: false,
  },
]

const STATUS_STEPS: OrderStatus[] = ['received', 'preparing', 'ready', 'served']

const bilingual = true

export default function ScanToOrder() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [showCart, setShowCart] = useState(false)
  const [orderType, setOrderType] = useState<OrderType>('dine-in')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [activeCategory, setActiveCategory] = useState('noodles')
  const [cart, setCart] = useState<CartLine[]>([])
  const [lastCart, setLastCart] = useState<CartLine[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('promptpay')
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('received')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const trackingCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  const phoneInvalid = phone.replace(/\D/g, '').length < 9

  function goToMenu() {
    if (!phoneInvalid) {
      setScreen('menu')
      setShowCart(false)
    }
  }

  function incItemQty(item: MenuDef) {
    setCart((prev) => {
      const existing = prev.find((l) => l.key === item.id)
      if (existing) {
        return prev.map((l) =>
          l.key === item.id ? { ...l, qty: l.qty + 1 } : l,
        )
      }
      return [
        ...prev,
        {
          key: item.id,
          id: item.id,
          name: item.name,
          basePrice: item.price,
          qty: 1,
        },
      ]
    })
  }

  function decItemQty(item: MenuDef) {
    setCart((prev) =>
      prev
        .map((l) => (l.key === item.id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    )
  }

  function updateCartQty(key: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) =>
          l.key === key ? { ...l, qty: Math.max(0, l.qty + delta) } : l,
        )
        .filter((l) => l.qty > 0),
    )
  }

  function removeCartLine(key: string) {
    setCart((prev) => prev.filter((l) => l.key !== key))
  }

  function placeOrder() {
    if (cart.length === 0) return
    const num = 'A' + Math.floor(100 + Math.random() * 900)
    setOrderNumber(num)
    setOrderStatus('received')
    setLastCart(cart)
    setCart([])
    setShowCart(false)
    setScreen('tracking')

    timers.current.forEach((t) => clearTimeout(t))
    timers.current = [
      setTimeout(() => setOrderStatus('preparing'), 4000),
      setTimeout(() => setOrderStatus('ready'), 10000),
      setTimeout(() => setOrderStatus('served'), 16000),
    ]
  }

  function newOrder() {
    timers.current.forEach((t) => clearTimeout(t))
    setScreen('menu')
    setOrderNumber(null)
    setOrderStatus('received')
    setLastCart([])
  }

  async function saveTrackingPhoto() {
    if (!trackingCardRef.current) return
    const dataUrl = await toPng(trackingCardRef.current, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
    })
    const link = document.createElement('a')
    link.download = `order-${orderNumber ?? 'receipt'}.png`
    link.href = dataUrl
    link.click()
  }

  const cartQtyById: Record<string, number> = {}
  cart.forEach((l) => {
    cartQtyById[l.id] = l.qty
  })

  const filteredItems = MENU.filter((i) => i.category === activeCategory)

  const cartCount = cart.reduce((sum, l) => sum + l.qty, 0)
  const subtotal = cart.reduce((sum, l) => sum + l.basePrice * l.qty, 0)
  const vat = Math.round(subtotal * 0.07)
  const total = subtotal + vat
  const cartIsEmpty = cart.length === 0

  const trackingLines = lastCart.map((l) => ({
    ...l,
    lineTotal: l.basePrice * l.qty,
  }))
  const trackingSubtotal = trackingLines.reduce(
    (sum, l) => sum + l.lineTotal,
    0,
  )
  const trackingVat = Math.round(trackingSubtotal * 0.07)
  const trackingTotal = trackingSubtotal + trackingVat

  const currentIdx = STATUS_STEPS.indexOf(orderStatus)

  return (
    <div className='relative min-h-screen bg-muted/40 text-foreground'>
      {screen === 'landing' && (
        <div className='flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-6 text-center sm:gap-5 sm:px-5 sm:py-8'>
          <div className='flex flex-col items-center gap-3 sm:gap-4'>
            <div className='max-w-80 text-3xl leading-snug font-light tracking-wide text-foreground/80 sm:max-w-100 sm:text-4xl'>
              Scan · Order · Enjoy
              {bilingual && (
                <div className="mt-0.5 font-['Noto_Sans_Thai',sans-serif] text-3xl font-light sm:text-[36px]">
                  สแกน สั่ง อิ่มอร่อย
                </div>
              )}
            </div>

            <Badge
              variant='secondary'
              className='h-auto gap-1 rounded-full px-2.5 text-xs font-semibold sm:px-3 sm:text-[13px]'
            >
              <Check className='size-3 text-green-600' strokeWidth={3} />
              Table 12 · Ready to order
            </Badge>
          </div>

          <div className='mt-1 w-full max-w-85 text-left sm:mt-2 sm:max-w-90'>
            <div className='mb-2 text-sm font-semibold sm:mb-2.5 sm:text-base'>
              Name
              {bilingual && (
                <span className="font-['Noto_Sans_Thai',sans-serif] font-normal text-muted-foreground">
                  {' '}
                  · ชื่อ
                </span>
              )}
            </div>
            <Input
              type='text'
              placeholder='Your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='h-auto rounded-xl border-[1.5px] px-3 py-2.5 text-base sm:px-4.5 sm:py-4.5 sm:text-lg'
            />
          </div>

          <div className='w-full max-w-85 text-left sm:max-w-90'>
            <div className='mb-2 text-sm font-semibold sm:mb-2.5 sm:text-base'>
              Mobile Number
              {bilingual && (
                <span className="font-['Noto_Sans_Thai',sans-serif] font-normal text-muted-foreground">
                  {' '}
                  · เบอร์โทรศัพท์
                </span>
              )}
            </div>
            <Input
              type='tel'
              inputMode='tel'
              placeholder='08X-XXX-XXXX'
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className='h-auto rounded-xl border-[1.5px] px-3 py-2.5 text-base sm:px-4.5 sm:py-4.5 sm:text-lg'
            />
          </div>

          <Button
            size='lg'
            onClick={goToMenu}
            disabled={phoneInvalid}
            className='mt-1 h-auto w-full max-w-85 rounded-xl py-3 text-sm font-bold shadow-sm sm:max-w-90 sm:py-5 sm:text-lg'
          >
            View Menu
            {bilingual && (
              <span className="ml-1.5 font-['Noto_Sans_Thai',sans-serif] font-medium">
                · ดูเมนู
              </span>
            )}
          </Button>
        </div>
      )}

      {screen === 'menu' && (
        <div className='min-h-screen pb-15'>
          <div className='sticky top-0 z-20 flex flex-wrap items-center gap-4 border-b border-border bg-background px-5 py-3.5'>
            <div className='flex min-w-0 flex-1 items-center gap-2.5'>
              <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                <QrCode className='size-4.5' />
              </div>
              <div className='min-w-0'>
                <div className='text-sm font-bold whitespace-nowrap'>
                  Baan Baan Kitchen
                </div>
                <div className='text-xs text-muted-foreground capitalize'>
                  Table 12 · {orderType}
                </div>
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='relative shrink-0'
              onClick={() => setShowCart((v) => !v)}
            >
              <ShoppingCart className='size-4.75' />
              {cartCount > 0 && (
                <span className='absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-muted bg-red-600 px-1 text-[11px] font-bold text-white'>
                  {cartCount}
                </span>
              )}
            </Button>
          </div>

          <div className='flex gap-5 overflow-x-auto border-b border-border bg-background px-5'>
            {CATEGORIES.map((cat) => {
              const active = cat.id === activeCategory
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'shrink-0 border-b-2 py-3 text-sm whitespace-nowrap',
                    active
                      ? 'border-foreground font-semibold text-foreground'
                      : 'border-transparent font-medium text-muted-foreground',
                  )}
                >
                  {cat.name}
                  {bilingual && (
                    <span className="ml-1 font-['Noto_Sans_Thai',sans-serif]">
                      {cat.nameTh}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className='flex flex-col gap-3 px-5 pt-4.5 pb-10'>
            {filteredItems.map((item) => {
              const qty = cartQtyById[item.id] || 0
              return (
                <div
                  key={item.id}
                  className='flex items-stretch gap-3.5 rounded-[10px] border border-border bg-background p-3'
                >
                  <div className='flex size-28 shrink-0 items-center justify-center rounded-lg bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_10px,var(--border)_10px,var(--border)_20px)] p-1.5 text-center font-mono text-[10px] tracking-wide text-muted-foreground uppercase'>
                    {item.name} photo
                  </div>
                  <div className='flex min-w-0 flex-1 flex-col justify-between gap-1'>
                    <div>
                      <div className='flex items-start justify-between gap-2'>
                        <div className='text-[15px] font-semibold'>
                          {item.name}
                        </div>
                      </div>
                      {bilingual && (
                        <div className="font-['Noto_Sans_Thai',sans-serif] text-xs text-muted-foreground">
                          {item.nameTh}
                        </div>
                      )}
                      <div className='mt-1 line-clamp-2 text-[13px] leading-snug text-muted-foreground'>
                        {item.desc}
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='text-sm font-bold'>฿{item.price}</div>
                      {qty > 0 ? (
                        <div className='flex items-center gap-2.5'>
                          <Button
                            variant='outline'
                            size='icon-sm'
                            onClick={() => decItemQty(item)}
                          >
                            <Minus className='size-3.5' />
                          </Button>
                          <div className='min-w-3.5 text-center text-sm font-bold'>
                            {qty}
                          </div>
                          <Button
                            size='icon-sm'
                            onClick={() => incItemQty(item)}
                          >
                            <Plus className='size-3.5' />
                          </Button>
                        </div>
                      ) : (
                        <Button size='sm' onClick={() => incItemQty(item)}>
                          + Add
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {screen === 'tracking' && (
        <div className='flex min-h-screen items-center justify-center px-5 py-8'>
          <div className='flex w-full max-w-140 flex-col gap-6'>
            <div
              ref={trackingCardRef}
              className='flex flex-col gap-6 rounded-xl border border-border bg-background p-8'
            >
              <div className='text-center'>
                <div className='text-xs tracking-wide text-muted-foreground uppercase'>
                  Order Number
                </div>
                <div className='mt-1 text-[30px] font-extrabold'>
                  {orderNumber}
                </div>
                <div className='mt-1.5 text-[13px] text-muted-foreground capitalize'>
                  {orderType} · Table 12
                </div>
              </div>

              <div className='flex flex-col gap-2.5'>
                <div className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
                  Order Summary
                </div>
                {trackingLines.map((tl) => (
                  <div key={tl.key} className='flex justify-between text-sm'>
                    <div>
                      {tl.qty}× {tl.name}
                    </div>
                    <div className='font-semibold'>฿{tl.lineTotal}</div>
                  </div>
                ))}
                <div className='mt-1 flex justify-between border-t border-border pt-2.5 text-[15px] font-bold'>
                  <div>Total Paid</div>
                  <div>฿{trackingTotal}</div>
                </div>
              </div>
            </div>

            <Button
              size='lg'
              variant='outline'
              className='h-auto rounded-[10px] py-3.5 text-sm'
              onClick={saveTrackingPhoto}
            >
              <Camera className='size-4' />
              Save Photo
            </Button>

            <Button
              size='lg'
              className='h-auto rounded-[10px] py-3.5 text-sm'
              onClick={newOrder}
            >
              Order More Items
            </Button>
          </div>
        </div>
      )}

      <Sheet open={showCart} onOpenChange={setShowCart}>
        <SheetContent className='flex w-full max-w-none flex-col gap-0 p-0 sm:max-w-105'>
          <SheetHeader className='flex-row items-center justify-between gap-2 border-b border-border p-4.5'>
            <SheetTitle className='text-base font-bold'>
              Your Order{' '}
              {bilingual && (
                <span className="font-['Noto_Sans_Thai',sans-serif] text-[13px] font-medium text-muted-foreground">
                  · ออเดอร์ของคุณ
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className='flex flex-1 flex-col gap-3.5 overflow-y-auto p-4.5'>
            {cartIsEmpty && (
              <div className='px-2.5 py-10 text-center text-sm text-muted-foreground'>
                Your cart is empty
                <br />
                ตะกร้าว่างเปล่า
              </div>
            )}
            {cart.map((line) => (
              <div
                key={line.key}
                className='flex gap-3 border-b border-border/60 pb-3.5'
              >
                <div className='flex-1'>
                  <div className='text-sm font-semibold'>{line.name}</div>
                  <div className='mt-2 flex items-center gap-2.5'>
                    <Button
                      variant='outline'
                      size='icon-sm'
                      onClick={() => updateCartQty(line.key, -1)}
                    >
                      <Minus className='size-3' />
                    </Button>
                    <div className='text-[13px] font-semibold'>{line.qty}</div>
                    <Button
                      variant='outline'
                      size='icon-sm'
                      onClick={() => updateCartQty(line.key, 1)}
                    >
                      <Plus className='size-3' />
                    </Button>
                  </div>
                </div>
                <div className='flex flex-col items-end justify-between text-right'>
                  <div className='text-sm font-bold'>
                    ฿{line.basePrice * line.qty}
                  </div>
                  <button
                    onClick={() => removeCartLine(line.key)}
                    aria-label='Remove item'
                    className='mb-1 mr-1'
                  >
                    <Trash2 className='size-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className='flex flex-col gap-3 border-t border-border p-4.5'>
            <div className='flex justify-between text-[13px] text-muted-foreground'>
              <div>Subtotal</div>
              <div>฿{subtotal}</div>
            </div>
            <div className='flex justify-between text-base font-bold'>
              <div>Total</div>
              <div>฿{total}</div>
            </div>

            <div className='flex gap-2'>
              <Button
                variant={paymentMethod === 'promptpay' ? 'default' : 'outline'}
                size='xs'
                onClick={() => setPaymentMethod('promptpay')}
              >
                PromptPay QR
              </Button>
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                size='xs'
                onClick={() => setPaymentMethod('card')}
              >
                Card
              </Button>
              <Button
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                size='xs'
                onClick={() => setPaymentMethod('cash')}
              >
                Cash
              </Button>
            </div>

            <Button
              size='lg'
              className='h-auto rounded-[10px] py-3.5 text-sm'
              disabled={cartIsEmpty}
              onClick={placeOrder}
            >
              Place Order · ฿{total}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
