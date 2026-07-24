'use client'

import { useState } from 'react'

import { cn } from '@/src/lib/utils'
import { Card } from '@/src/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/src/components/ui/table'

import {
  INITIAL_TABLES,
  WEEK_SALES,
  MONTH_SALES,
  YEAR_SALES,
  type Order,
  type TableRec,
} from '../data'
import ordersData from '../orders/orders.json'

type Period = 'week' | 'month' | 'year'

const PERIOD_DATA: Record<Period, typeof WEEK_SALES> = {
  week: WEEK_SALES,
  month: MONTH_SALES,
  year: YEAR_SALES,
}

const PERIOD_LABELS: Record<Period, string> = {
  week: 'ยอดขายสัปดาห์นี้',
  month: 'ยอดขายรายเดือน',
  year: 'ยอดขายรายปี',
}

const PERIOD_RANGE_LABELS: Record<Period, string> = {
  week: 'สัปดาห์นี้',
  month: 'เดือนนี้',
  year: 'ปีนี้',
}

const PERIOD_ORDER_COUNTS: Record<Period, number> = {
  week: 812,
  month: 3480,
  year: 41600,
}

export default function SalesPage() {
  const [orders] = useState<Order[]>(ordersData as Order[])
  const [tables] = useState<TableRec[]>(INITIAL_TABLES)
  const [period, setPeriod] = useState<Period>('week')

  const salesData = PERIOD_DATA[period]
  const maxSales = Math.max(...salesData.map((d) => d.sales))

  const periodSales =
    period === 'week'
      ? orders.reduce((sum, o) => sum + o.total, 0)
      : salesData.reduce((sum, d) => sum + d.sales, 0)
  const periodOrders =
    period === 'week' ? orders.length : PERIOD_ORDER_COUNTS[period]
  const activeTableCount = tables.filter((t) => t.status !== 'empty').length
  const avgOrderValue = periodOrders
    ? Math.round(periodSales / periodOrders)
    : 0

  const statCards = [
    {
      label: `ยอดขาย${PERIOD_RANGE_LABELS[period]}`,
      value: `฿${periodSales.toLocaleString()}`,
    },
    {
      label: `ออเดอร์${PERIOD_RANGE_LABELS[period]}`,
      value: periodOrders.toLocaleString(),
    },
    { label: 'โต๊ะที่ใช้งาน', value: `${activeTableCount} / ${tables.length}` },
    { label: 'ค่าเฉลี่ยต่อออเดอร์', value: `฿${avgOrderValue}` },
  ]

  return (
    <div className='px-8 pt-12 pb-15'>
      <div className='mb-1 text-[36px] leading-[1.11] font-normal tracking-[-0.5px]'>
        สรุปยอดขาย
      </div>
      <div className='mb-8 text-base text-muted-foreground'>
        สรุปผลการดำเนินงาน{PERIOD_RANGE_LABELS[period]}
      </div>

      <div className='mb-7 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4'>
        {statCards.map((stat) => (
          <Card key={stat.label} className='gap-2 px-5 py-4.5'>
            <div className='text-[13px] font-semibold text-muted-foreground'>
              {stat.label}
            </div>
            <div className='font-mono text-[18px] font-medium'>
              {stat.value}
            </div>
          </Card>
        ))}
      </div>

      <Card className='gap-5 px-6 py-6'>
        <div className='flex items-center justify-between gap-3'>
          <div className='text-[13px] font-bold text-muted-foreground'>
            {PERIOD_LABELS[period]}
          </div>
          <Tabs
            value={period}
            onValueChange={(value) => setPeriod(value as Period)}
          >
            <TabsList className='h-8 p-0.5'>
              <TabsTrigger value='week' className='px-3 py-1 text-xs'>
                สัปดาห์
              </TabsTrigger>
              <TabsTrigger value='month' className='px-3 py-1 text-xs'>
                เดือน
              </TabsTrigger>
              <TabsTrigger value='year' className='px-3 py-1 text-xs'>
                ปี
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className='flex gap-3'>
          <div className='flex h-35 flex-col justify-between text-right text-[11px] text-muted-foreground'>
            {[4, 3, 2, 1, 0].map((step) => (
              <span key={step}>
                ฿{Math.round((maxSales * step) / 4).toLocaleString()}
              </span>
            ))}
          </div>

          <div className='flex flex-1 flex-col gap-2'>
            <div className='relative flex h-35 items-end gap-3.5'>
              <div className='pointer-events-none absolute inset-0 flex flex-col justify-between'>
                {[0, 1, 2, 3, 4].map((step) => (
                  <div key={step} className='h-px bg-border' />
                ))}
              </div>

              {salesData.map((bar, idx) => {
                const isLatest = idx === salesData.length - 1
                return (
                  <div
                    key={bar.day}
                    className='relative flex h-full flex-1 items-end justify-center'
                  >
                    <div
                      className={cn(
                        'w-full max-w-9 transition-colors',
                        isLatest ? 'bg-primary' : 'bg-border',
                      )}
                      style={{
                        height: `${Math.round((bar.sales / maxSales) * 100)}%`,
                      }}
                    />
                  </div>
                )
              })}
            </div>

            <div className='flex gap-3.5'>
              {salesData.map((bar, idx) => {
                const isLatest = idx === salesData.length - 1
                return (
                  <div
                    key={bar.day}
                    className={cn(
                      'flex-1 text-center text-[11px]',
                      isLatest
                        ? 'font-bold text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {bar.day}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>

      <Card className='mt-5 gap-0 overflow-hidden py-0'>
        <div className='px-5 pt-4.5 pb-3.5 text-[13px] font-bold text-muted-foreground'>
          {PERIOD_LABELS[period]}
        </div>
        <Table>
          <TableBody>
            {salesData.map((bar, idx) => {
              const isLatest = idx === salesData.length - 1
              return (
                <TableRow key={bar.day} className='hover:bg-transparent'>
                  <TableCell
                    className={cn(
                      'py-3.5 pl-5',
                      isLatest
                        ? 'font-bold text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {bar.day}
                  </TableCell>
                  <TableCell className='pr-5 text-right font-mono font-medium'>
                    ฿{bar.sales.toLocaleString()}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
