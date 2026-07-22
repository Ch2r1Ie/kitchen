'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Update = {
  imgLabel: string
  imgSrc?: string
  date: string
  title: string
  desc: string
}

const UPDATES: Update[] = [
  {
    imgLabel: 'seasonal menu photo',
    imgSrc:
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=520&h=325&fit=crop&q=80',
    date: 'Jul 22, 2026',
    title: 'New Seasonal Menu Is Here',
    desc: 'Fresh grilled squid and basil fried rice just added — available for a limited time.',
  },
  // {
  //   imgLabel: 'promotion photo',
  //   date: 'Jun 28, 2026',
  //   title: '20% Off This Weekend',
  //   desc: 'Scan, order and enjoy 20% off all noodle dishes, Saturday and Sunday only.',
  // },
  // {
  //   imgLabel: 'takeaway photo',
  //   date: 'Jun 15, 2026',
  //   title: 'Now Open for Takeaway',
  //   desc: 'Skip the table — order ahead and pick up your favorites on the way home.',
  // },
  // {
  //   imgLabel: 'songkran photo',
  //   date: 'Jun 3, 2026',
  //   title: 'Songkran Family Set',
  //   desc: 'A shareable set for four — soup, rice, grilled skewers and dessert at one price.',
  // },
  // {
  //   imgLabel: 'renovation photo',
  //   date: 'May 20, 2026',
  //   title: 'Fresh New Dining Room',
  //   desc: 'We refreshed the seating area — come see the new look on your next visit.',
  // },
  // {
  //   imgLabel: 'hiring photo',
  //   date: 'May 8, 2026',
  //   title: "We're Hiring Kitchen Staff",
  //   desc: 'Join our growing team — message us on LINE to apply.',
  // },
]

export function WhatHappen() {
  const trackRef = useRef<HTMLDivElement>(null)

  function scrollTrack(dir: number) {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <div id='updates' className='bg-white px-6 py-24 sm:px-12'>
      <div className='mx-auto max-w-300'>
        <div className='mb-8 flex flex-wrap items-end justify-between gap-3'>
          <div>
            <div className='text-[36px] leading-[1.11] font-normal tracking-[-0.5px]'>
              What&apos;s Happening
            </div>
            <div className='mt-3 text-[16px] text-[#5b616e]'>
              Latest news, menus and promotions from the kitchen
            </div>
          </div>
          <div className='flex shrink-0 gap-2'>
            <button
              onClick={() => scrollTrack(-1)}
              className='flex size-11 items-center justify-center rounded-full bg-[#eef0f3] text-[#0a0b0d]'
            >
              <ChevronLeft className='size-4' />
            </button>
            <button
              onClick={() => scrollTrack(1)}
              className='flex size-11 items-center justify-center rounded-full bg-[#eef0f3] text-[#0a0b0d]'
            >
              <ChevronRight className='size-4' />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className='flex gap-5 overflow-x-auto scroll-smooth pb-1.5 [scroll-snap-type:x_mandatory]'
        >
          {UPDATES.map((u) => (
            <div
              key={u.title}
              className='w-65 shrink-0 overflow-hidden rounded-2xl bg-white outline outline-[#dee1e6] snap-start'
            >
              <div className='flex aspect-16/10 items-center justify-center overflow-hidden bg-[#f7f7f7]'>
                {u.imgSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={u.imgSrc}
                    alt={u.imgLabel}
                    className='size-full object-cover'
                  />
                ) : (
                  <span className='font-mono text-[11px] tracking-wide text-[#7c828a] uppercase'>
                    {u.imgLabel}
                  </span>
                )}
              </div>
              <div className='px-4.5 py-4.5'>
                <div className='text-[12px] font-semibold tracking-wide text-[#7c828a] uppercase'>
                  {u.date}
                </div>
                <div className='mt-1.5 text-[16px] font-semibold'>
                  {u.title}
                </div>
                <div className='mt-1.5 text-[14px] leading-[1.5] text-[#5b616e]'>
                  {u.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
