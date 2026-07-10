'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, QrCode } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type Update = { imgLabel: string; date: string; title: string; desc: string }

const UPDATES: Update[] = [
  {
    imgLabel: 'seasonal menu photo',
    date: 'Jul 5, 2026',
    title: 'New Seasonal Menu Is Here',
    desc: 'Fresh grilled squid and basil fried rice just added — available for a limited time.',
  },
  {
    imgLabel: 'promotion photo',
    date: 'Jun 28, 2026',
    title: '20% Off This Weekend',
    desc: 'Scan, order and enjoy 20% off all noodle dishes, Saturday and Sunday only.',
  },
  {
    imgLabel: 'takeaway photo',
    date: 'Jun 15, 2026',
    title: 'Now Open for Takeaway',
    desc: 'Skip the table — order ahead and pick up your favorites on the way home.',
  },
  {
    imgLabel: 'songkran photo',
    date: 'Jun 3, 2026',
    title: 'Songkran Family Set',
    desc: 'A shareable set for four — soup, rice, grilled skewers and dessert at one price.',
  },
  {
    imgLabel: 'renovation photo',
    date: 'May 20, 2026',
    title: 'Fresh New Dining Room',
    desc: 'We refreshed the seating area — come see the new look on your next visit.',
  },
  {
    imgLabel: 'hiring photo',
    date: 'May 8, 2026',
    title: "We're Hiring Kitchen Staff",
    desc: 'Join our growing team — message us on LINE to apply.',
  },
]

export default function Website() {
  const [isMobile, setIsMobile] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const signInTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (signInTimer.current) clearTimeout(signInTimer.current)
    }
  }, [])

  function scrollTrack(dir: number) {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  function openLogin() {
    setShowLogin(true)
    setSigningIn(false)
  }

  function signIn() {
    setSigningIn(true)
    signInTimer.current = setTimeout(() => {
      window.location.href = '/portal'
    }, 1100)
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Nav */}
      <div className='sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-6 py-4 sm:px-8'>
        {isMobile ? (
          <div className='flex size-8.5 items-center justify-center rounded-[9px] bg-primary text-primary-foreground'>
            <QrCode className='size-4.25' />
          </div>
        ) : (
          <div className='text-[17px] font-extrabold'>Baan Baan Kitchen</div>
        )}
        <div className='flex items-center gap-7'>
          <a
            href='#updates'
            className='text-sm font-semibold text-foreground/70 hover:text-foreground'
          >
            Updates
          </a>
          <Button variant='outline' onClick={openLogin}>
            Login
          </Button>
        </div>
      </div>

      {/* Hero */}
      <div className='mx-auto max-w-180 px-6 py-20 pb-16 text-center sm:px-8'>
        <div className='text-[44px] leading-[1.15] font-extrabold tracking-tight'>
          Baan Baan Kitchen
        </div>
        <div className="mt-1.5 font-['Noto_Sans_Thai',sans-serif] text-[22px] text-muted-foreground">
          บ้าน บ้าน คิทเช่น
        </div>
        <div className="mt-5 font-['Noto_Sans_Thai',sans-serif] text-[19px] leading-relaxed text-foreground/70">
          ระบบสแกนสั่งอาหารสำหรับร้านอาหาร ลดคน เพิ่มยอดขาย พร้อมใช้งานทันที
        </div>
        <div className='mt-8 flex flex-wrap justify-center gap-3'>
          <a
            href='https://line.me/'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 rounded-xl bg-[#06c755] px-6 py-3.5 text-[15px] font-bold text-white'
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='white'>
              <path d='M12 2C6.48 2 2 5.9 2 10.7c0 4.3 3.6 7.9 8.4 8.6.3.06.7.2.8.46.1.24.06.6.03.85l-.13 1c-.04.3-.24 1.17 1.02.64 1.27-.53 6.83-4.02 9.32-6.88C22.9 13.55 24 12.2 24 10.7 24 5.9 17.52 2 12 2z'></path>
            </svg>
            Add Friend
          </a>
          <a
            href='https://youtube.com/'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 rounded-xl bg-[#ff0000] px-6 py-3.5 text-[15px] font-bold text-white'
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='white'>
              <path d='M23 12s0-3.4-.4-5c-.3-1-1-1.8-2-2C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.6.5c-1 .2-1.7 1-2 2C1 8.6 1 12 1 12s0 3.4.4 5c.3 1 1 1.8 2 2 1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5c1-.2 1.7-1 2-2 .4-1.6.4-5 .4-5zM9.8 15.5v-7l6 3.5-6 3.5z'></path>
            </svg>
            YouTube
          </a>
        </div>
      </div>

      {/* Updates */}
      <div
        id='updates'
        className='border-t border-border bg-muted/40 px-6 py-14 sm:px-8'
      >
        <div className='mx-auto max-w-280'>
          <div className='mb-6 flex flex-wrap items-end justify-between gap-3'>
            <div>
              <div className='text-[26px] font-extrabold'>
                What&apos;s Happening
              </div>
              <div className='mt-1.5 text-[15px] text-muted-foreground'>
                Latest news, menus and promotions from the kitchen
              </div>
            </div>
            <div className='flex shrink-0 gap-2'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => scrollTrack(-1)}
              >
                <ChevronLeft className='size-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => scrollTrack(1)}
              >
                <ChevronRight className='size-4' />
              </Button>
            </div>
          </div>

          <div
            ref={trackRef}
            className='flex gap-5 overflow-x-auto scroll-smooth pb-1.5 [scroll-snap-type:x_mandatory]'
          >
            {UPDATES.map((u) => (
              <Card
                key={u.title}
                className='w-65 shrink-0 gap-0 overflow-hidden rounded-[14px] py-0 snap-start'
              >
                <div className='flex aspect-16/10 items-center justify-center bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_10px,var(--border)_10px,var(--border)_20px)] font-mono text-[11px] tracking-wide text-muted-foreground uppercase'>
                  {u.imgLabel}
                </div>
                <div className='px-4.5 py-4.5'>
                  <div className='text-[11px] font-bold tracking-wide text-muted-foreground uppercase'>
                    {u.date}
                  </div>
                  <div className='mt-1.5 text-base font-bold'>{u.title}</div>
                  <div className='mt-1.5 text-[13px] leading-relaxed text-muted-foreground'>
                    {u.desc}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className='mt-9 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-[#06c755] p-8'>
            <div>
              <div className='text-[19px] font-extrabold text-white'>
                Get every update on LINE
              </div>
              <div className='mt-1 text-sm text-white/85'>
                โปรโมชั่น เมนูใหม่ และข่าวสารร้าน ส่งตรงถึงมือคุณ
              </div>
            </div>
            <a
              href='https://line.me/'
              target='_blank'
              rel='noopener noreferrer'
              className='flex shrink-0 items-center gap-2 rounded-[10px] bg-white px-6 py-3.5 text-[15px] font-bold text-[#06c755]'
            >
              <svg width='18' height='18' viewBox='0 0 24 24' fill='#06c755'>
                <path d='M12 2C6.48 2 2 5.9 2 10.7c0 4.3 3.6 7.9 8.4 8.6.3.06.7.2.8.46.1.24.06.6.03.85l-.13 1c-.04.3-.24 1.17 1.02.64 1.27-.53 6.83-4.02 9.32-6.88C22.9 13.55 24 12.2 24 10.7 24 5.9 17.52 2 12 2z'></path>
              </svg>
              Add Friend
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='bg-[#18181b] px-6 pt-13 text-white sm:px-8'>
        <div className='mx-auto grid max-w-240 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 pb-10'>
          <div>
            <div className='text-[17px] font-extrabold'>Baan Baan Kitchen</div>
            <div className="mt-1 font-['Noto_Sans_Thai',sans-serif] text-sm text-zinc-400">
              บ้าน บ้าน คิทเช่น
            </div>
            <div className="mt-3 max-w-55 font-['Noto_Sans_Thai',sans-serif] text-[13px] leading-relaxed text-zinc-400">
              ระบบสแกนสั่งอาหารสำหรับร้านอาหาร ลดคน เพิ่มยอดขาย พร้อมใช้งานทันที
            </div>
          </div>

          <div>
            <div className='mb-3.5 text-xs font-bold tracking-wide text-zinc-500 uppercase'>
              Explore
            </div>
            <div className='flex flex-col gap-2.5'>
              <a
                href='#updates'
                className='text-sm text-zinc-300 hover:text-white'
              >
                Updates
              </a>
              <Link
                href='/scan'
                className='text-sm text-zinc-300 hover:text-white'
              >
                Order Now
              </Link>
              <button
                onClick={openLogin}
                className='text-left text-sm text-zinc-300 hover:text-white'
              >
                Login
              </button>
            </div>
          </div>

          <div>
            <div className='mb-3.5 text-xs font-bold tracking-wide text-zinc-500 uppercase'>
              Contact
            </div>
            <div className='text-sm leading-loose text-zinc-300'>
              88 Sukhumvit Soi 24
              <br />
              Khlong Toei, Bangkok
              <br />
              02-123-4567
              <br />
              hello@baansuankitchen.co.th
            </div>
          </div>

          <div>
            <div className='mb-3.5 text-xs font-bold tracking-wide text-zinc-500 uppercase'>
              Follow Us
            </div>
            <div className='flex flex-col gap-3'>
              <a
                href='https://line.me/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-sm text-zinc-300 hover:text-white'
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='#06c755'>
                  <path d='M12 2C6.48 2 2 5.9 2 10.7c0 4.3 3.6 7.9 8.4 8.6.3.06.7.2.8.46.1.24.06.6.03.85l-.13 1c-.04.3-.24 1.17 1.02.64 1.27-.53 6.83-4.02 9.32-6.88C22.9 13.55 24 12.2 24 10.7 24 5.9 17.52 2 12 2z'></path>
                </svg>
                LINE
              </a>
              <a
                href='https://youtube.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-sm text-zinc-300 hover:text-white'
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='#ff0000'>
                  <path d='M23 12s0-3.4-.4-5c-.3-1-1-1.8-2-2C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.6.5c-1 .2-1.7 1-2 2C1 8.6 1 12 1 12s0 3.4.4 5c.3 1 1 1.8 2 2 1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5c1-.2 1.7-1 2-2 .4-1.6.4-5 .4-5zM9.8 15.5v-7l6 3.5-6 3.5z'></path>
                </svg>
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className='mx-auto max-w-240 border-t border-zinc-800 py-5 text-[13px] text-zinc-500'>
          © 2026 Baan Baan Kitchen. All rights reserved.
        </div>
      </div>

      {/* Login Modal */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className='max-w-sm'>
          <DialogHeader className='text-center'>
            <DialogTitle className='text-2xl'>Welcome Back</DialogTitle>
            <DialogDescription>
              เข้าสู่ระบบเพื่อจัดการคำสั่งซื้อ เมนู และยอดขาย
            </DialogDescription>
          </DialogHeader>

          <div className='flex flex-col gap-3'>
            <Button
              variant='outline'
              size='lg'
              onClick={signIn}
              disabled={signingIn}
              className='h-auto gap-2.5 rounded-[10px] py-3 text-sm font-semibold'
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
            </Button>
          </div>

          <div className='flex items-center gap-3 text-xs text-muted-foreground'>
            <div className='h-px flex-1 bg-border' />
            Or
            <div className='h-px flex-1 bg-border' />
          </div>

          <div className='flex flex-col gap-3'>
            <Input
              placeholder='Enter your email address'
              type='email'
              className='h-auto rounded-lg px-3.5 py-2.5'
            />
            <Input
              placeholder='Enter your password'
              type='password'
              className='h-auto rounded-lg px-3.5 py-2.5'
            />
          </div>

          <div className='flex items-center justify-between text-sm'>
            <label className='flex items-center gap-2 text-muted-foreground'>
              <Checkbox />
              Remember Me
            </label>
            <a href='#' className='font-medium text-foreground hover:underline'>
              Forgot Password?
            </a>
          </div>

          <Button
            size='lg'
            onClick={signIn}
            disabled={signingIn}
            className='h-auto w-full rounded-[10px] py-3 text-sm font-semibold'
          >
            {signingIn ? 'Signing in…' : 'Sign In'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
