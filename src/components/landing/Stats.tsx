'use client'

import { Wallet, Receipt, Store } from 'lucide-react'
import { useQueryWebsiteStats } from '@/src/hooks/api/useQueryWebsiteStats'

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0,
})

export function Stats() {
  const { data: stats } = useQueryWebsiteStats()

  return (
    <div className='bg-white px-6 py-24 sm:px-12'>
      <div className='mx-auto max-w-300'>
        <div className='mb-12 text-center'>
          <div className='text-[36px] leading-[1.11] font-normal tracking-[-0.5px]'>
            Trusted at Scale
          </div>
          <div className='mt-3 text-[16px] text-[#5b616e]'>
            Real numbers from restaurants running on our platform
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
          <div className='flex flex-col items-center rounded-2xl bg-white p-8 text-center outline outline-[#dee1e6]'>
            <div className='flex size-8 items-center justify-center rounded-full bg-[#eef0f3] text-[#0052ff]'>
              <Wallet className='size-4' />
            </div>
            <div className='mt-4 font-(family-name:--font-coinbase) text-[18px] font-medium'>
              {stats ? currencyFormatter.format(stats.totalAmount) : '—'}
            </div>
            <div className='mt-1 text-[14px] text-[#5b616e]'>
              Total Sales Processed
            </div>
          </div>

          <div className='flex flex-col items-center rounded-2xl bg-white p-8 text-center outline outline-[#dee1e6]'>
            <div className='flex size-8 items-center justify-center rounded-full bg-[#eef0f3] text-[#0052ff]'>
              <Receipt className='size-4' />
            </div>
            <div className='mt-4 font-(family-name:--font-coinbase) text-[18px] font-medium'>
              {stats ? stats.totalOrders.toLocaleString() : '—'}
            </div>
            <div className='mt-1 text-[14px] text-[#5b616e]'>Orders Served</div>
          </div>

          <div className='flex flex-col items-center rounded-2xl bg-white p-8 text-center outline outline-[#dee1e6]'>
            <div className='flex size-8 items-center justify-center rounded-full bg-[#eef0f3] text-[#0052ff]'>
              <Store className='size-4' />
            </div>
            <div className='mt-4 font-(family-name:--font-coinbase) text-[18px] font-medium'>
              {stats ? stats.totalRestaurants.toLocaleString() : '—'}
            </div>
            <div className='mt-1 text-[14px] text-[#5b616e]'>
              Restaurants Onboard
            </div>
          </div>
        </div>

        {/* {stats && stats.monthly.length > 0 && (
          <div className='mt-6 rounded-2xl bg-white p-8 outline outline-[#dee1e6]'>
            <div className='mb-6 text-[16px] font-semibold'>Monthly Orders</div>
            <div className='flex items-end gap-3 overflow-x-auto pb-1.5'>
              {stats.monthly.map((m) => {
                const max = Math.max(
                  ...stats.monthly.map((x) => x.totalOrders),
                  1,
                )
                const heightPct = Math.max((m.totalOrders / max) * 100, 4)
                return (
                  <div
                    key={m.month}
                    className='flex w-14 shrink-0 flex-col items-center gap-2'
                  >
                    <div className='flex h-32 w-full items-end'>
                      <div
                        className='w-full rounded-t-sm bg-[#0052ff]'
                        style={{ height: `${heightPct}%` }}
                        title={`${m.totalOrders} orders · ${currencyFormatter.format(m.totalAmount)}`}
                      />
                    </div>
                    <div className='text-[13px] text-[#7c828a]'>{m.month}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}
