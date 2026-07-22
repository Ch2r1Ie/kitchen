'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Inter } from 'next/font/google'
import { QrCode, ArrowUpRight, Menu } from 'lucide-react'

import { Input } from '@/src/components/ui/input'
import { Checkbox } from '@/src/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/components/ui/dialog'
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
          <div>
            <div className='text-[40px] leading-[1.09] font-normal tracking-[-1px] sm:text-[64px] sm:leading-[1.0] sm:tracking-[-1.6px]'>
              BaanBaan Kitchen
            </div>
            <div className='mt-6 max-w-110 text-[16px] leading-[1.5] text-[#a8acb3]'>
              Scan-to-order system for restaurants — fewer staff, more sales,
              ready to use instantly.
            </div>
            <div className='mt-8 flex flex-wrap gap-3'>
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

      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className='max-w-sm rounded-2xl'>
          <DialogHeader className='text-center'>
            <DialogTitle className='text-[32px] font-normal tracking-[-0.4px]'>
              Welcome Back
            </DialogTitle>
            <DialogDescription>
              Sign in to manage orders, menu and sales
            </DialogDescription>
          </DialogHeader>

          <div className='flex flex-col gap-3'>
            <button
              onClick={signIn}
              disabled={signingIn}
              className='flex items-center justify-center gap-2.5 rounded-full bg-[#eef0f3] px-5 py-3 text-[16px] font-semibold text-[#0a0b0d] disabled:opacity-50'
            >
              <svg width='18' height='18' viewBox='0 0 48 48'>
                <path
                  fill='#FFC107'
                  d='M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z'
                />
                <path
                  fill='#FF3D00'
                  d='M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6.1 29.5 4 24 4c-7.6 0-14.2 4.3-17.7 10.7z'
                />
                <path
                  fill='#4CAF50'
                  d='M24 45c5.3 0 10.2-2 13.8-5.3l-6.4-5.4C29.4 35.7 26.8 36.5 24 36.5c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.7 40.5 16.3 45 24 45z'
                />
                <path
                  fill='#1976D2'
                  d='M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.5 4.6-4.6 6l6.4 5.4C40.5 36.6 43 30.8 43 24c0-1.2-.1-2.4-.4-3.5z'
                />
              </svg>
              Login with Google
            </button>
          </div>

          <div className='flex items-center gap-3 text-[13px] text-[#7c828a]'>
            <div className='h-px flex-1 bg-[#dee1e6]' />
            Or
            <div className='h-px flex-1 bg-[#dee1e6]' />
          </div>

          <div className='flex flex-col gap-3'>
            <Input
              placeholder='Enter your email address'
              type='email'
              className='h-12 rounded-xl border-[#dee1e6] px-4 py-3.5'
            />
            <Input
              placeholder='Enter your password'
              type='password'
              className='h-12 rounded-xl border-[#dee1e6] px-4 py-3.5'
            />
          </div>

          <div className='flex items-center justify-between text-sm'>
            <label className='flex items-center gap-2 text-[#5b616e]'>
              <Checkbox />
              Remember Me
            </label>
            <a
              href='#'
              className='font-semibold text-[#0052ff] hover:underline'
            >
              Forgot Password?
            </a>
          </div>

          <button
            onClick={signIn}
            disabled={signingIn}
            className='w-full rounded-full bg-[#0052ff] py-4 text-[16px] font-semibold text-white disabled:opacity-50'
          >
            {signingIn ? 'Signing in…' : 'Sign In'}
          </button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
