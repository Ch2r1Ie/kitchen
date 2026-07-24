'use client'

import { useMemo, useState } from 'react'
import { ImagePlus, Trash2, X } from 'lucide-react'

import { cn } from '@/src/lib/utils'
import { Button } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Switch } from '@/src/components/ui/switch'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/src/components/ui/combobox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table'

import { type Category, type MenuItem } from '../data'
import menuData from './menu.json'
import categoriesData from './categories.json'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuData as MenuItem[])
  const [categories, setCategories] = useState<Category[]>(
    categoriesData as Category[],
  )

  const [activeCategory, setActiveCategory] = useState<number>(
    categories[0]?.id ?? 0,
  )

  const [newItemName, setNewItemName] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemImage, setNewItemImage] = useState('')

  const [newCategoryName, setNewCategoryName] = useState('')

  const categoryCounts = useMemo(() => {
    const counts: Record<number, number> = {}
    menuItems.forEach((m) => {
      counts[m.category] = (counts[m.category] ?? 0) + 1
    })
    return counts
  }, [menuItems])

  const filteredItems = useMemo(() => {
    return menuItems.filter((m) => m.category === activeCategory)
  }, [menuItems, activeCategory])

  function addMenuItem() {
    const name = newItemName.trim()
    if (!name) return
    const category = categories.find((c) => c.nameTh === newItemCategory)
    if (!category) return
    const price = parseInt(newItemPrice, 10) || 0
    const item: MenuItem = {
      id: Date.now(),
      image: newItemImage || 'https://picsum.photos/400/300',
      category: category.id,
      name,
      nameTh: name,
      desc: '',
      price,
      spicy: false,
      available: true,
    }
    setMenuItems((prev) => [item, ...prev])
    setNewItemName('')
    setNewItemCategory('')
    setNewItemPrice('')
    setNewItemImage('')
  }

  function handleNewItemImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setNewItemImage(URL.createObjectURL(file))
  }

  function setItemPrice(id: number, price: number) {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, price } : m)))
  }

  function toggleItemAvailable(id: number) {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m)),
    )
  }

  function deleteItem(id: number) {
    setMenuItems((prev) => prev.filter((m) => m.id !== id))
  }

  function addCategory() {
    const name = newCategoryName.trim()
    if (!name) return
    const id = Date.now()
    setCategories((prev) => [...prev, { id, name, nameTh: name }])
    setNewCategoryName('')
  }

  function removeCategory(id: number) {
    if (categoryCounts[id]) return
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className='px-8 pt-12 pb-15'>
      <div className='mb-8'>
        <div className='mb-1 text-[36px] leading-[1.11] font-normal tracking-[-0.5px]'>
          จัดการเมนู
        </div>
        <div className='text-base text-muted-foreground'>
          {menuItems.length} รายการ · เปิด/ปิดสถานะ แก้ไขราคา หรือเพิ่มเมนูใหม่
        </div>
      </div>

      <Card className='mb-5 gap-4 px-5 py-4.5'>
        <div>
          <div className='text-[13px] font-bold'>หมวดหมู่ทั้งหมด</div>
          <div className='text-xs text-muted-foreground'>
            {categories.length} หมวดหมู่ · ลบได้เฉพาะหมวดที่ไม่มีเมนู
          </div>
        </div>

        <div className='divide-y divide-border rounded-lg border border-border'>
          {categories.map((c) => {
            const count = categoryCounts[c.id] ?? 0
            const canRemove = !count
            return (
              <div
                key={c.id}
                className='flex items-center justify-between gap-3 px-3.5 py-2.5 text-[13px]'
              >
                <span className='font-semibold'>{c.nameTh}</span>
                <div className='flex items-center gap-3'>
                  <span className='text-xs text-muted-foreground'>
                    {count} เมนู
                  </span>
                  <button
                    onClick={() => removeCategory(c.id)}
                    disabled={!canRemove}
                    title={
                      canRemove ? 'ลบหมวดหมู่' : 'ลบไม่ได้ เพราะมีเมนูอยู่'
                    }
                    className='flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors enabled:hover:bg-destructive enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-30'
                  >
                    <X className='size-3' />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className='flex items-end gap-2.5'>
          <div className='flex-1'>
            <div className='mb-1.5 text-xs font-semibold text-muted-foreground'>
              ชื่อหมวดหมู่ใหม่
            </div>
            <Input
              type='text'
              placeholder='เช่น ของหมัก'
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className='h-auto py-2.25'
            />
          </div>
          <Button onClick={addCategory}>+ เพิ่ม</Button>
        </div>
      </Card>

      <Card className='mb-5 gap-4 px-5 py-4.5'>
        <div>
          <div className='text-[13px] font-bold'>เพิ่มเมนูใหม่</div>
          <div className='text-xs text-muted-foreground'>
            อัปโหลดรูป ตั้งชื่อ เลือกหมวดหมู่ และกำหนดราคา
          </div>
        </div>

        <div className='grid grid-cols-[auto_1fr] gap-5'>
          <label className='flex size-full h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-dashed border-border bg-muted/40 text-muted-foreground hover:bg-muted/70'>
            {newItemImage ? (
              <img
                src={newItemImage}
                alt='ตัวอย่างรูปเมนู'
                className='size-full object-cover'
              />
            ) : (
              <>
                <ImagePlus className='size-6' />
                <span className='text-[11px] leading-tight'>เพิ่มรูป</span>
              </>
            )}
            <input
              type='file'
              accept='image/*'
              onChange={handleNewItemImage}
              className='hidden'
            />
          </label>

          <div className='grid grid-cols-2 gap-3'>
            <div className='col-span-2'>
              <div className='mb-1.5 text-xs font-semibold text-muted-foreground'>
                ชื่อเมนู
              </div>
              <Input
                type='text'
                placeholder='เช่น แกงเขียวหวาน'
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className='h-auto py-2.25'
              />
            </div>

            <div>
              <div className='mb-1.5 text-xs font-semibold text-muted-foreground'>
                หมวดหมู่
              </div>
              <Combobox
                items={categories.map((c) => c.nameTh)}
                value={newItemCategory || null}
                onValueChange={(value) => setNewItemCategory(value ?? '')}
              >
                <ComboboxInput placeholder='เลือกหมวดหมู่' />
                <ComboboxContent>
                  <ComboboxEmpty>ไม่พบหมวดหมู่</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className='flex items-end gap-3'>
              <div className='flex-1'>
                <div className='mb-1.5 text-xs font-semibold text-muted-foreground'>
                  ราคา
                </div>
                <div className='relative'>
                  <Input
                    type='number'
                    placeholder='0'
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className='h-auto py-2.25 pr-11'
                  />
                  <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground'>
                    THB
                  </span>
                </div>
              </div>
              <Button onClick={addMenuItem}>บันทึก</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className='gap-0 overflow-hidden py-0'>
        <div className='flex gap-5 overflow-x-auto border-b border-border px-5'>
          {categories.map((c) => {
            const active = c.id === activeCategory
            return (
              <button
                key={c.id}
                type='button'
                onClick={() => setActiveCategory(c.id)}
                className={cn(
                  'shrink-0 border-b-2 py-3 text-sm whitespace-nowrap',
                  active
                    ? 'border-foreground font-semibold text-foreground'
                    : 'border-transparent font-normal text-muted-foreground',
                )}
              >
                {c.nameTh}
              </button>
            )
          })}
        </div>

        <Table>
          <TableHeader className='sr-only'>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((m) => (
              <TableRow key={m.id} className='hover:bg-transparent'>
                <TableCell className='w-16 py-3.5 pl-5'>
                  <div className='size-13 rounded-full bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_8px,var(--border)_8px,var(--border)_16px)]' />
                </TableCell>
                <TableCell>
                  <div className='text-sm font-semibold'>{m.nameTh}</div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <span className='text-[13px] text-muted-foreground'>฿</span>
                    <Input
                      type='number'
                      value={m.price}
                      onChange={(e) =>
                        setItemPrice(m.id, parseInt(e.target.value, 10) || 0)
                      }
                      className='h-auto w-16 py-1.5 font-mono text-[13px]'
                    />
                  </div>
                </TableCell>
                <TableCell className='w-30'>
                  <div className='flex items-center gap-2'>
                    <Switch
                      checked={m.available}
                      onCheckedChange={() => toggleItemAvailable(m.id)}
                    />
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        m.available
                          ? 'text-green-700'
                          : 'text-muted-foreground',
                      )}
                    >
                      {m.available ? 'พร้อมขาย' : 'หมด'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='w-12 pr-5'>
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    onClick={() => deleteItem(m.id)}
                  >
                    <Trash2 className='size-4 text-muted-foreground' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
