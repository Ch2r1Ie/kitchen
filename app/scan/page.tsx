'use client'

import { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import {
  Camera,
  Check,
  Minus,
  Plus,
  QrCode,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  UtensilsCrossed,
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
  image: string
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
  nameTh: string
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
    image: 'https://picsum.photos/400/300',
    category: 'appetizers',
    name: 'Fresh Spring Rolls',
    nameTh: 'ปอเปี๊ยะสด',
    desc: 'Rice paper rolls with herbs, shrimp & peanut sauce',
    price: 89,
    spicy: false,
  },
  {
    id: 'wonton',
    image: 'https://picsum.photos/400/300',
    category: 'appetizers',
    name: 'Fried Wontons',
    nameTh: 'เกี๊ยวทอด',
    desc: 'Crispy pork wontons, sweet chili sauce',
    price: 79,
    spicy: false,
  },
  {
    id: 'somtum',
    image: 'https://picsum.photos/400/300',
    category: 'appetizers',
    name: 'Papaya Salad',
    nameTh: 'ส้มตำ',
    desc: 'Green papaya, tomato, peanut, lime, chili',
    price: 99,
    spicy: true,
  },
  {
    id: 'padthai',
    image: 'https://picsum.photos/400/300',
    category: 'noodles',
    name: 'Pad Thai',
    nameTh: 'ผัดไทย',
    desc: 'Stir-fried rice noodles, shrimp, tofu, egg, peanuts',
    price: 129,
    spicy: true,
  },
  {
    id: 'padseeew',
    image: 'https://picsum.photos/400/300',
    category: 'noodles',
    name: 'Pad See Ew',
    nameTh: 'ผัดซีอิ๊ว',
    desc: 'Wide rice noodles, Chinese broccoli, dark soy',
    price: 119,
    spicy: false,
  },
  {
    id: 'boatnoodle',
    image: 'https://picsum.photos/400/300',
    category: 'noodles',
    name: 'Boat Noodles',
    nameTh: 'ก๋วยเตี๋ยวเรือ',
    desc: 'Rich pork broth, herbs, blood tofu',
    price: 69,
    spicy: true,
  },
  {
    id: 'khaopad',
    image: 'https://picsum.photos/400/300',
    category: 'rice',
    name: 'Thai Fried Rice',
    nameTh: 'ข้าวผัด',
    desc: 'Jasmine rice, egg, onion, choice of protein',
    price: 109,
    spicy: false,
  },
  {
    id: 'khaomangai',
    image: 'https://picsum.photos/400/300',
    category: 'rice',
    name: 'Khao Man Gai',
    nameTh: 'ข้าวมันไก่',
    desc: 'Hainanese chicken rice, ginger-soy sauce',
    price: 99,
    spicy: false,
  },
  {
    id: 'basilrice',
    image: 'https://picsum.photos/400/300',
    category: 'rice',
    name: 'Basil Fried Rice',
    nameTh: 'ข้าวผัดกะเพรา',
    desc: 'Holy basil, chili, garlic, fried egg on top',
    price: 109,
    spicy: true,
  },
  {
    id: 'moopin',
    image: 'https://picsum.photos/400/300',
    category: 'grilled',
    name: 'Grilled Pork Skewers',
    nameTh: 'หมูปิ้ง',
    desc: 'Marinated pork skewers, charcoal grilled (5 pcs)',
    price: 59,
    spicy: false,
  },
  {
    id: 'satay',
    image: 'https://picsum.photos/400/300',
    category: 'grilled',
    name: 'Chicken Satay',
    nameTh: 'สะเต๊ะไก่',
    desc: 'Grilled chicken skewers, peanut sauce (5 pcs)',
    price: 89,
    spicy: false,
  },
  {
    id: 'grilledsquid',
    image: 'https://picsum.photos/400/300',
    category: 'grilled',
    name: 'Grilled Squid',
    nameTh: 'ปลาหมึกย่าง',
    desc: 'Whole squid, seafood dipping sauce',
    price: 159,
    spicy: true,
  },
  {
    id: 'tomyum',
    image: 'https://picsum.photos/400/300',
    category: 'soups',
    name: 'Tom Yum Goong',
    nameTh: 'ต้มยำกุ้ง',
    desc: 'Hot & sour prawn soup, lemongrass, chili',
    price: 149,
    spicy: true,
  },
  {
    id: 'tomkha',
    image: 'https://picsum.photos/400/300',
    category: 'soups',
    name: 'Tom Kha Gai',
    nameTh: 'ต้มข่าไก่',
    desc: 'Coconut galangal soup with chicken',
    price: 119,
    spicy: true,
  },
  {
    id: 'thaitea',
    image: 'https://picsum.photos/400/300',
    category: 'drinks',
    name: 'Thai Iced Tea',
    nameTh: 'ชาไทย',
    desc: 'Sweet milk tea over ice',
    price: 49,
    spicy: false,
  },
  {
    id: 'limesoda',
    image: 'https://picsum.photos/400/300',
    category: 'drinks',
    name: 'Fresh Lime Soda',
    nameTh: 'โซดามะนาว',
    desc: 'Soda, fresh lime, a touch of salt',
    price: 45,
    spicy: false,
  },
  {
    id: 'coconut',
    image: 'https://picsum.photos/400/300',
    category: 'drinks',
    name: 'Coconut Water',
    nameTh: 'น้ำมะพร้าว',
    desc: 'Young coconut, served in the shell',
    price: 59,
    spicy: false,
  },
  {
    id: 'mangosticky',
    image: 'https://picsum.photos/400/300',
    category: 'desserts',
    name: 'Mango Sticky Rice',
    nameTh: 'ข้าวเหนียวมะม่วง',
    desc: 'Sweet sticky rice, coconut cream, ripe mango',
    price: 99,
    spicy: false,
  },
  {
    id: 'coconuticecream',
    image: 'https://picsum.photos/400/300',
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
    image: 'https://picsum.photos/400/300',
    category: 'appetizers',
    name: 'Thai Fish Cakes',
    nameTh: 'ทอดมันปลา',
    desc: 'Curried fish cakes served with cucumber relish',
    price: 99,
    spicy: true,
  },
  {
    id: 'shrimpcake',
    image: 'https://picsum.photos/400/300',
    category: 'appetizers',
    name: 'Shrimp Cakes',
    nameTh: 'ทอดมันกุ้ง',
    desc: 'Golden fried shrimp cakes with plum sauce',
    price: 129,
    spicy: false,
  },
  {
    id: 'larbmoo',
    image: 'https://picsum.photos/400/300',
    category: 'appetizers',
    name: 'Larb Moo',
    nameTh: 'ลาบหมู',
    desc: 'Minced pork salad with herbs, lime and toasted rice',
    price: 109,
    spicy: true,
  },
  {
    id: 'yumwoonsen',
    image: 'https://picsum.photos/400/300',
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
    image: 'https://picsum.photos/400/300',
    category: 'noodles',
    name: 'Drunken Noodles',
    nameTh: 'ผัดขี้เมา',
    desc: 'Spicy stir-fried flat noodles with holy basil',
    price: 129,
    spicy: true,
  },
  {
    id: 'radna',
    image: 'https://picsum.photos/400/300',
    category: 'noodles',
    name: 'Rad Na',
    nameTh: 'ราดหน้า',
    desc: 'Wide noodles with pork and Chinese broccoli in gravy',
    price: 119,
    spicy: false,
  },
  {
    id: 'yentafo',
    image: 'https://picsum.photos/400/300',
    category: 'noodles',
    name: 'Yen Ta Fo',
    nameTh: 'เย็นตาโฟ',
    desc: 'Pink noodle soup with seafood and tofu',
    price: 109,
    spicy: true,
  },
  {
    id: 'suukhothainoodle',
    image: 'https://picsum.photos/400/300',
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
    image: 'https://picsum.photos/400/300',
    category: 'rice',
    name: 'Holy Basil Pork',
    nameTh: 'ผัดกะเพราหมู',
    desc: 'Stir-fried minced pork with holy basil and fried egg',
    price: 119,
    spicy: true,
  },
  {
    id: 'garlicrice',
    image: 'https://picsum.photos/400/300',
    category: 'rice',
    name: 'Garlic Pork Rice',
    nameTh: 'ข้าวหมูกระเทียม',
    desc: 'Garlic pepper pork served over jasmine rice',
    price: 109,
    spicy: false,
  },
  {
    id: 'greenchickencurry',
    image: 'https://picsum.photos/400/300',
    category: 'rice',
    name: 'Green Curry Chicken',
    nameTh: 'แกงเขียวหวานไก่',
    desc: 'Green curry with chicken, eggplant and jasmine rice',
    price: 139,
    spicy: true,
  },
  {
    id: 'massamancurry',
    image: 'https://picsum.photos/400/300',
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
    image: 'https://picsum.photos/400/300',
    category: 'grilled',
    name: 'Thai Grilled Chicken',
    nameTh: 'ไก่ย่าง',
    desc: 'Marinated grilled chicken with spicy dipping sauce',
    price: 139,
    spicy: true,
  },
  {
    id: 'korib',
    image: 'https://picsum.photos/400/300',
    category: 'grilled',
    name: 'Grilled Pork Neck',
    nameTh: 'คอหมูย่าง',
    desc: 'Charcoal grilled pork neck with jaew sauce',
    price: 149,
    spicy: true,
  },
  {
    id: 'grilledprawns',
    image: 'https://picsum.photos/400/300',
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
    image: 'https://picsum.photos/400/300',
    category: 'soups',
    name: 'Clear Tofu Soup',
    nameTh: 'แกงจืดเต้าหู้',
    desc: 'Clear broth with tofu, pork and vegetables',
    price: 99,
    spicy: false,
  },
  {
    id: 'tomsaap',
    image: 'https://picsum.photos/400/300',
    category: 'soups',
    name: 'Tom Saap Pork Ribs',
    nameTh: 'ต้มแซ่บกระดูกอ่อน',
    desc: 'Hot and sour pork rib soup with herbs',
    price: 149,
    spicy: true,
  },
  {
    id: 'kaengsom',
    image: 'https://picsum.photos/400/300',
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
    image: 'https://picsum.photos/400/300',
    category: 'drinks',
    name: 'Thai Green Milk Tea',
    nameTh: 'ชาเขียวนม',
    desc: 'Sweet Thai green tea with milk',
    price: 49,
    spicy: false,
  },
  {
    id: 'lemontea',
    image: 'https://picsum.photos/400/300',
    category: 'drinks',
    name: 'Lemon Iced Tea',
    nameTh: 'ชามะนาว',
    desc: 'Fresh brewed black tea with lemon',
    price: 45,
    spicy: false,
  },
  {
    id: 'roselle',
    image: 'https://picsum.photos/400/300',
    category: 'drinks',
    name: 'Roselle Juice',
    nameTh: 'น้ำกระเจี๊ยบ',
    desc: 'Refreshing homemade roselle drink',
    price: 40,
    spicy: false,
  },
  {
    id: 'butterflypea',
    image: 'https://picsum.photos/400/300',
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
    image: 'https://picsum.photos/400/300',
    category: 'desserts',
    name: 'Lod Chong',
    nameTh: 'ลอดช่อง',
    desc: 'Pandan noodles in coconut milk with ice',
    price: 59,
    spicy: false,
  },
  {
    id: 'tubtimkrob',
    image: 'https://picsum.photos/400/300',
    category: 'desserts',
    name: 'Tub Tim Grob',
    nameTh: 'ทับทิมกรอบ',
    desc: 'Water chestnuts in coconut milk with crushed ice',
    price: 69,
    spicy: false,
  },
  {
    id: 'bananafritter',
    image: 'https://picsum.photos/400/300',
    category: 'desserts',
    name: 'Fried Banana',
    nameTh: 'กล้วยทอด',
    desc: 'Crispy fried bananas with sesame',
    price: 59,
    spicy: false,
  },
  {
    id: 'kanomkrok',
    image: 'https://picsum.photos/400/300',
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

  function formatPhone(digits: string) {
    const d = digits.slice(0, 10)
    if (d.length <= 3) return d
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  }

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
          nameTh: item.nameTh,
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
  const vat = Math.round(subtotal)
  const total = subtotal
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
    <div className='relative min-h-screen bg-white text-[#1d1d1f]'>
      {screen === 'landing' && (
        <div className='flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-6 text-center sm:gap-5 sm:px-5 sm:py-8'>
          <div className='flex flex-col items-center gap-3 sm:gap-4'>
            <div className='max-w-80 text-3xl leading-tight font-semibold tracking-[-0.374px] text-[#1d1d1f] sm:max-w-100 sm:text-4xl'>
              Scan · Order · Enjoy
              {bilingual && (
                <div className="mt-0.5 font-['Noto_Sans_Thai',sans-serif] text-3xl font-semibold sm:text-[36px]">
                  สแกน สั่ง อิ่มอร่อย
                </div>
              )}
            </div>

            <Badge
              variant='outline'
              className='h-auto gap-1 rounded-full border-0 bg-[#fafafc] px-2.5 text-xs font-semibold text-[#333333] sm:px-3 sm:text-[13px]'
            >
              <Check className='size-3 text-[#000000]' strokeWidth={3} />
              Table 12 · Ready to order
            </Badge>
          </div>

          <div className='relative flex w-full max-w-85 rounded-full border border-[#e0e0e0] bg-[#f5f5f7] p-1 sm:max-w-90'>
            <div
              aria-hidden
              className={cn(
                'absolute inset-y-1 w-[calc(50%-0.125rem)] rounded-full bg-[#000000] transition-transform duration-200 ease-out',
                orderType === 'takeaway'
                  ? 'translate-x-[calc(100%+0.25rem)]'
                  : 'translate-x-0',
              )}
            />
            <button
              type='button'
              onClick={() => setOrderType('dine-in')}
              className={cn(
                'relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition-colors sm:py-3.5 sm:text-base',
                orderType === 'dine-in' ? 'text-white' : 'text-[#7a7a7a]',
              )}
            >
              <UtensilsCrossed className='size-4' />
              กินที่ร้าน
            </button>
            <button
              type='button'
              onClick={() => setOrderType('takeaway')}
              className={cn(
                'relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition-colors sm:py-3.5 sm:text-base',
                orderType === 'takeaway' ? 'text-white' : 'text-[#7a7a7a]',
              )}
            >
              <ShoppingBag className='size-4' />
              รับกลับบ้าน
            </button>
          </div>

          <div className='w-full max-w-85 text-left sm:max-w-90'>
            <div className='mb-2 text-sm font-semibold sm:mb-2.5 sm:text-base'>
              Mobile Number
              {bilingual && (
                <span className="font-['Noto_Sans_Thai',sans-serif] font-normal text-[#7a7a7a]">
                  {' '}
                  · เบอร์โทรศัพท์
                </span>
              )}
            </div>
            <Input
              type='tel'
              inputMode='tel'
              placeholder='08X-XXX-XXXX'
              value={formatPhone(phone)}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
              }
              className='h-auto rounded-full border-[1.5px] border-[#e0e0e0] px-4 py-2.5 text-base focus-visible:border-[#1d1d1f] focus-visible:ring-[#1d1d1f]/30 sm:px-4 sm:py-3 sm:text-lg'
            />
          </div>

          <Button
            size='lg'
            onClick={goToMenu}
            disabled={phoneInvalid}
            className='h-auto w-full max-w-85 rounded-full bg-[#000000] py-3 text-sm font-normal text-white transition-transform active:scale-95 hover:bg-[#1d1d1f] sm:max-w-90 sm:py-3 sm:text-lg'
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
        <div className='min-h-screen bg-white pb-15'>
          <div className='sticky top-0 z-20 flex flex-wrap items-center gap-4 border-b border-[#f0f0f0] bg-white/95 px-5 py-3.5 backdrop-blur'>
            <div className='flex min-w-0 flex-1 items-center gap-2.5'>
              <div className='flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-[#1d1d1f] text-white'>
                <QrCode className='size-4.5' />
              </div>
              <div className='min-w-0'>
                <div className='text-sm font-semibold whitespace-nowrap text-[#1d1d1f]'>
                  Baan Baan Kitchen
                </div>
                <div className='text-xs text-[#7a7a7a] capitalize'>
                  Table 12 · {orderType}
                </div>
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='relative shrink-0 text-[#1d1d1f] hover:bg-[#f5f5f7]'
              onClick={() => setShowCart((v) => !v)}
            >
              <ShoppingCart className='size-4.75' />
              {cartCount > 0 && (
                <span className='absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-white bg-[#000000] px-1 text-[11px] font-bold text-white'>
                  {cartCount}
                </span>
              )}
            </Button>
          </div>

          <div className='flex gap-5 overflow-x-auto border-b border-[#f0f0f0] bg-white px-5'>
            {CATEGORIES.map((cat) => {
              const active = cat.id === activeCategory
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'shrink-0 border-b-2 py-3 text-sm whitespace-nowrap',
                    active
                      ? 'border-[#000000] font-semibold text-[#000000]'
                      : 'border-transparent font-normal text-[#7a7a7a]',
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
                  className='flex items-stretch gap-3.5 rounded-[18px] border border-[#e0e0e0] bg-white p-3'
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className='size-28 shrink-0 rounded-[8px] object-cover'
                  />
                  <div className='flex min-w-0 flex-1 flex-col justify-between gap-1'>
                    <div>
                      <div className='flex items-start justify-between gap-2'>
                        <div className='text-[15px] font-semibold text-[#1d1d1f]'>
                          {item.nameTh}
                        </div>
                      </div>
                      {bilingual && (
                        <div className="font-['Noto_Sans_Thai',sans-serif] text-xs text-[#7a7a7a]">
                          {item.name}
                        </div>
                      )}
                      <div className='mt-1 line-clamp-2 text-[13px] leading-snug text-[#7a7a7a]'>
                        {item.desc}
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='text-sm font-semibold text-[#1d1d1f]'>
                        ฿{item.price}
                      </div>
                      {qty > 0 ? (
                        <div className='flex items-center gap-2.5'>
                          <Button
                            variant='outline'
                            size='icon-sm'
                            className='rounded-full border-[#000000] text-[#000000] hover:bg-[#f5f5f7]'
                            onClick={() => decItemQty(item)}
                          >
                            <Minus className='size-3.5' />
                          </Button>
                          <div className='min-w-3.5 text-center text-sm font-semibold text-[#1d1d1f]'>
                            {qty}
                          </div>
                          <Button
                            size='icon-sm'
                            className='rounded-full bg-[#000000] text-white transition-transform active:scale-95 hover:bg-[#1d1d1f]'
                            onClick={() => incItemQty(item)}
                          >
                            <Plus className='size-3.5' />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size='sm'
                          className='rounded-full bg-[#000000] text-white transition-transform active:scale-95 hover:bg-[#1d1d1f]'
                          onClick={() => incItemQty(item)}
                        >
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
        <div className='flex min-h-screen items-center justify-center bg-white px-5 py-8'>
          <div className='flex w-full max-w-140 flex-col gap-6'>
            <div
              ref={trackingCardRef}
              className='flex flex-col gap-6 rounded-[18px] border border-[#e0e0e0] bg-white p-8'
            >
              <div className='text-center'>
                <div className='text-xs tracking-wide text-[#7a7a7a] uppercase'>
                  Order Number
                </div>
                <div className='mt-1 text-[30px] font-semibold text-[#000000]'>
                  {orderNumber}
                </div>
                <div className='mt-1.5 text-[13px] text-[#7a7a7a] capitalize'>
                  {orderType} · Table 12
                </div>
              </div>

              <div className='flex flex-col gap-2.5'>
                <div className='text-xs font-semibold tracking-wide text-[#7a7a7a] uppercase'>
                  Order Summary
                </div>
                {trackingLines.map((tl) => (
                  <div
                    key={tl.key}
                    className='flex justify-between text-sm text-[#1d1d1f]'
                  >
                    <div>
                      {tl.qty}× {tl.name}
                    </div>
                    <div className='font-semibold'>฿{tl.lineTotal}</div>
                  </div>
                ))}
                <div className='mt-1 flex justify-between border-t border-[#e0e0e0] pt-2.5 text-[15px] font-semibold text-[#1d1d1f]'>
                  <div>Total Paid</div>
                  <div>฿{trackingTotal}</div>
                </div>
              </div>
            </div>

            <Button
              size='lg'
              variant='outline'
              className='h-auto rounded-full border-[#000000] py-3.5 text-sm text-[#000000] transition-transform active:scale-95 hover:bg-[#f5f5f7]'
              onClick={saveTrackingPhoto}
            >
              <Camera className='size-4' />
              Save Photo
            </Button>

            <Button
              size='lg'
              className='h-auto rounded-full bg-[#000000] py-3.5 text-sm text-white transition-transform active:scale-95 hover:bg-[#1d1d1f]'
              onClick={newOrder}
            >
              Order More Items
            </Button>
          </div>
        </div>
      )}

      <Sheet open={showCart} onOpenChange={setShowCart}>
        <SheetContent className='flex w-full max-w-none flex-col gap-0 bg-white p-0 sm:max-w-105'>
          <SheetHeader className='flex-row items-center justify-between gap-2 border-b border-[#f0f0f0] p-4.5'>
            <SheetTitle className='text-base font-semibold text-[#1d1d1f]'>
              Your Order{' '}
              {bilingual && (
                <span className="font-['Noto_Sans_Thai',sans-serif] text-[13px] font-medium text-[#7a7a7a]">
                  · ออเดอร์ของคุณ
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className='flex flex-1 flex-col gap-3.5 overflow-y-auto p-4.5'>
            {cartIsEmpty && (
              <div className='px-2.5 py-10 text-center text-sm text-[#7a7a7a]'>
                Your cart is empty
                <br />
                ตะกร้าว่างเปล่า
              </div>
            )}
            {cart.map((line) => (
              <div
                key={line.key}
                className='flex gap-3 border-b border-[#f0f0f0] pb-3.5'
              >
                <div className='flex-1'>
                  <div className='text-sm font-semibold text-[#1d1d1f]'>
                    {line.nameTh}
                  </div>
                  <div className='mt-2 flex items-center gap-2.5'>
                    <Button
                      variant='outline'
                      size='icon-sm'
                      className='rounded-full border-[#000000] text-[#000000] hover:bg-[#f5f5f7]'
                      onClick={() => updateCartQty(line.key, -1)}
                    >
                      <Minus className='size-3' />
                    </Button>
                    <div className='text-[13px] font-semibold text-[#1d1d1f]'>
                      {line.qty}
                    </div>
                    <Button
                      variant='outline'
                      size='icon-sm'
                      className='rounded-full border-[#000000] text-[#000000] hover:bg-[#f5f5f7]'
                      onClick={() => updateCartQty(line.key, 1)}
                    >
                      <Plus className='size-3' />
                    </Button>
                  </div>
                </div>
                <div className='flex flex-col items-end justify-between text-right'>
                  <div className='text-sm font-semibold text-[#1d1d1f]'>
                    ฿{line.basePrice * line.qty}
                  </div>
                  <button
                    onClick={() => removeCartLine(line.key)}
                    aria-label='Remove item'
                    className='mb-1 mr-1 text-[#7a7a7a] hover:text-[#1d1d1f]'
                  >
                    <Trash2 className='size-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className='flex flex-col gap-3 border-t border-[#f0f0f0] p-4.5'>
            <div className='flex justify-between text-[13px] text-[#7a7a7a]'>
              <div>Subtotal</div>
              <div>฿{subtotal}</div>
            </div>
            <div className='flex justify-between text-base font-semibold text-[#1d1d1f]'>
              <div>Total</div>
              <div>฿{total}</div>
            </div>

            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='xs'
                className={cn(
                  'rounded-full',
                  paymentMethod === 'promptpay'
                    ? 'border-[#000000] bg-[#000000] text-white hover:bg-[#1d1d1f]'
                    : 'border-[#e0e0e0] text-[#1d1d1f]',
                )}
                onClick={() => setPaymentMethod('promptpay')}
              >
                PromptPay QR
              </Button>
              <Button
                variant='outline'
                size='xs'
                className={cn(
                  'rounded-full',
                  paymentMethod === 'card'
                    ? 'border-[#000000] bg-[#000000] text-white hover:bg-[#1d1d1f]'
                    : 'border-[#e0e0e0] text-[#1d1d1f]',
                )}
                onClick={() => setPaymentMethod('card')}
              >
                Card
              </Button>
              <Button
                variant='outline'
                size='xs'
                className={cn(
                  'rounded-full',
                  paymentMethod === 'cash'
                    ? 'border-[#000000] bg-[#000000] text-white hover:bg-[#1d1d1f]'
                    : 'border-[#e0e0e0] text-[#1d1d1f]',
                )}
                onClick={() => setPaymentMethod('cash')}
              >
                Cash
              </Button>
            </div>

            <Button
              size='lg'
              className='h-auto rounded-full bg-[#000000] py-3.5 text-sm text-white transition-transform active:scale-95 hover:bg-[#1d1d1f]'
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
