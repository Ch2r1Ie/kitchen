'use client'

import { Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react'

const WHY_TILES = [
  {
    icon: Truck,
    title: 'Instant table service',
    desc: 'Scan the QR at your table and order in seconds — no app to install.',
  },
  {
    icon: RotateCcw,
    title: 'Live order tracking',
    desc: 'Watch your dishes move from kitchen to table in real time.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure checkout',
    desc: 'Pay by card or QR with bank-grade encryption on every order.',
  },
  {
    icon: CreditCard,
    title: 'No hidden fees',
    desc: 'Menu prices are what you pay — no surprise service charges.',
  },
]

export function WhyChooseUs() {
  return (
    <div className='bg-[#f7f7f7] px-6 py-24 sm:px-12'>
      <div className='mx-auto max-w-300'>
        <div className='mb-12 text-[36px] leading-[1.11] font-normal tracking-[-0.5px]'>
          Why restaurants choose us
        </div>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {WHY_TILES.map((tile) => (
            <div
              key={tile.title}
              className='flex flex-col items-center rounded-2xl bg-white p-8 text-center'
            >
              <tile.icon
                className='size-6 text-[#0052ff]'
                strokeWidth={1.75}
              />
              <div className='mt-4 text-[18px] font-semibold'>
                {tile.title}
              </div>
              <div className='mt-2 text-[14px] leading-[1.5] text-[#5b616e]'>
                {tile.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
