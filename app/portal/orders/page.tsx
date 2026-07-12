'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

import { STATUS_LABELS, statusBadgeClass, type Order } from '../data'
import ordersData from './orders.json'

const PAGE_SIZE = 20

export default function OrdersPage() {
  const [orders] = useState<Order[]>(ordersData as Order[])
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(orders.length / PAGE_SIZE))
  const pageOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return orders.slice(start, start + PAGE_SIZE)
  }, [orders, page])

  return (
    <div className='px-8 pt-7 pb-15'>
      <div className='mb-0.5 text-[22px] font-extrabold'>ออเดอร์ล่าสุด</div>
      <div className='mb-6 text-sm text-muted-foreground'>
        รายการออเดอร์ล่าสุด · {orders.length} รายการ
      </div>

      <Card className='gap-0 overflow-hidden py-0'>
        <Table>
          <TableBody>
            {pageOrders.map((o) => (
              <TableRow key={o.id} className='hover:bg-transparent'>
                <TableCell className='w-14 py-3.5 pl-5 font-bold'>
                  {o.id}
                </TableCell>
                <TableCell className='w-18 text-muted-foreground'>
                  โต๊ะ {o.table}
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {o.items.map((it) => (
                    <div key={it.name}>
                      {it.qty} × {it.nameTh}
                    </div>
                  ))}
                </TableCell>
                <TableCell className='text-right font-bold'>
                  ฿{o.total}
                </TableCell>
                <TableCell className='pr-5 text-right'>
                  <Badge
                    className={cn(
                      'h-auto rounded-full px-2.5 py-1 font-bold',
                      statusBadgeClass(o.status),
                    )}
                  >
                    {STATUS_LABELS[o.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className='mt-4 flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>
          หน้า {page} จาก {pageCount}
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='icon-sm'
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className='size-4' />
          </Button>
          <Button
            variant='outline'
            size='icon-sm'
            disabled={page >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            <ChevronRight className='size-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
