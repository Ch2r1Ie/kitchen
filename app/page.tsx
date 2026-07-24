'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Inter } from 'next/font/google'
import { QrCode, ArrowUpRight, Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/src/components/ui/sheet'
import { useQueryWebsiteStats } from '@/src/hooks/api/useQueryWebsiteStats'
import { Footer } from '@/src/components/landing/Footer'
import { WhatHappen } from '@/src/components/landing/WhatHappen'
import { Stats } from '@/src/components/landing/Stats'
import { WhyChooseUs } from '@/src/components/landing/WhyChooseUs'
import { LineCta } from '@/src/components/landing/LineCta'
import { LoginDialog } from '@/src/components/landing/LoginDialog'
import { Button } from '@base-ui/react'

const inter = Inter({
  variable: '--font-coinbase',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function Website() {
  const [showLogin, setShowLogin] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const signInTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { data: stats } = useQueryWebsiteStats()

  useEffect(() => {
    return () => {
      if (signInTimer.current) clearTimeout(signInTimer.current)
    }
  }, [])

  function openLogin() {
    setShowLogin(true)
    setSigningIn(false)
    setShowMobileNav(false)
  }

  function signIn() {
    setSigningIn(true)
    signInTimer.current = setTimeout(() => {
      window.location.href = '/portal'
    }, 1100)
  }

  const currencyFormatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  })

  const monthlyDelta =
    stats && stats.monthly.length >= 2
      ? stats.monthly[stats.monthly.length - 1].totalOrders -
        stats.monthly[stats.monthly.length - 2].totalOrders
      : null

  return (
    <div
      className={`${inter.variable} min-h-screen bg-white font-(family-name:--font-coinbase) text-[#0a0b0d]`}
    >
      <div className='sticky top-0 z-40 border-b border-[#eef0f3] bg-white/90 backdrop-blur-sm'>
        <div className='mx-auto flex h-16 max-w-300 items-center justify-between gap-3 px-6 sm:px-12'>
          <Link href='/' className='flex items-center gap-2.5'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0052ff] text-white'>
              <QrCode className='size-4.5' strokeWidth={2} />
            </div>
            <div className='text-[16px] font-semibold whitespace-nowrap'>
              BaanBaan Kitchen
            </div>
          </Link>

          <div className='hidden items-center gap-8 sm:flex'>
            <a
              href='#updates'
              className='text-[14px] font-medium text-[#5b616e] hover:text-[#0a0b0d]'
            >
              Updates
            </a>
            <button
              onClick={openLogin}
              className='rounded-full bg-[#0052ff] px-5 py-3 text-[16px] font-semibold text-white'
            >
              Get started
            </button>
          </div>

          <div className='flex items-center gap-2 sm:hidden'>
            <button
              onClick={() => setShowMobileNav(true)}
              aria-label='Open menu'
              className='flex size-11 items-center justify-center rounded-full bg-[#eef0f3] text-[#0a0b0d]'
            >
              <Menu className='size-5' />
            </button>
          </div>
        </div>
      </div>

      <Sheet open={showMobileNav} onOpenChange={setShowMobileNav}>
        <SheetContent
          side='right'
          className='w-full max-w-none gap-0 border-0 bg-white p-0 sm:hidden'
        >
          <div className='flex h-full flex-col gap-1 p-4'>
            <a
              href='#updates'
              onClick={() => setShowMobileNav(false)}
              className='rounded-xl px-3 py-3.5 text-[16px] font-medium text-[#0a0b0d]'
            >
              Updates
            </a>

            <button
              onClick={openLogin}
              className='mt-auto rounded-full bg-[#0052ff] px-5 py-3.5 text-center text-[16px] font-semibold text-white'
            >
              Get started
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <div className='relative overflow-hidden bg-[#0a0b0d] px-6 py-24 text-white sm:px-12'>
        <div className='mx-auto grid max-w-300 grid-cols-1 items-center gap-16 lg:grid-cols-2'>
          <div className='text-center sm:text-left'>
            <div className='text-[40px] leading-[1.09] font-normal tracking-[-1px] sm:text-[64px] sm:leading-[1.0] sm:tracking-[-1.6px]'>
              BaanBaan Kitchen
            </div>
            <div className='mx-auto mt-6 max-w-110 text-[16px] leading-[1.5] text-[#a8acb3] sm:mx-0'>
              Scan-to-order system for restaurants — fewer staff, more sales,
              ready to use instantly.
            </div>
            <div className='mt-8 flex flex-wrap justify-center gap-3 sm:justify-start'>
              <Button
                onClick={openLogin}
                className='rounded-full bg-[#0052ff] px-8 py-4 text-[16px] font-semibold text-white transition-colors hover:bg-[#003ecc]'
              >
                Order Now
              </Button>
              <a
                href='https://line.me/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.75 text-[16px] font-semibold text-white transition-colors hover:bg-white/10'
              >
                <svg width='18' height='18' viewBox='0 0 24 24' fill='#06c755'>
                  <path d='M12 2C6.48 2 2 5.9 2 10.7c0 4.3 3.6 7.9 8.4 8.6.3.06.7.2.8.46.1.24.06.6.03.85l-.13 1c-.04.3-.24 1.17 1.02.64 1.27-.53 6.83-4.02 9.32-6.88C22.9 13.55 24 12.2 24 10.7 24 5.9 17.52 2 12 2z' />
                </svg>
                Add Friend on LINE
              </a>
            </div>
          </div>

          {/* Layered product-UI mockup cards */}
          <div className='relative h-70 sm:h-80'>
            <div className='absolute inset-0 rotate-2 rounded-2xl bg-[#16181c] p-8'>
              <div className='text-[13px] text-[#a8acb3]'>
                Today&apos;s Sales
              </div>
              <div className='mt-2 font-(family-name:--font-coinbase) text-[18px] font-medium'>
                {stats ? currencyFormatter.format(stats.totalAmount) : '—'}
              </div>
              <div className='mt-6 text-[13px] text-[#a8acb3]'>
                Orders Served
              </div>
              <div className='mt-2 font-(family-name:--font-coinbase) text-[18px] font-medium'>
                {stats ? stats.totalOrders.toLocaleString() : '—'}
              </div>
            </div>
            <div className='absolute inset-x-6 -bottom-6 -rotate-3 rounded-2xl bg-[#16181c] p-8 shadow-[0_4px_12px_rgba(0,0,0,0.3)]'>
              <div className='flex items-center justify-between'>
                <div className='text-[13px] text-[#a8acb3]'>
                  Table 12 — Order #482
                </div>
                {monthlyDelta !== null && (
                  <div
                    className={`flex items-center gap-1 text-[18px] font-medium ${
                      monthlyDelta >= 0 ? 'text-[#05b169]' : 'text-[#cf202f]'
                    }`}
                  >
                    <ArrowUpRight className='size-4' />
                    {monthlyDelta >= 0 ? '+' : ''}
                    {monthlyDelta}
                  </div>
                )}
              </div>
              <div className='mt-3 text-[14px] text-[#a8acb3]'>
                Grilled squid, basil fried rice
              </div>
            </div>
          </div>
        </div>
      </div>

      <Stats />
      <WhyChooseUs />
      <WhatHappen />
      <LineCta />
      <Footer onLoginClick={openLogin} />

      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onSignIn={signIn}
        signingIn={signingIn}
      />
    </div>
  )
}
