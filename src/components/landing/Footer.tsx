import Link from 'next/link'
import { QrCode } from 'lucide-react'

type FooterProps = {
  onLoginClick: () => void
}

const LINE_ICON_PATH =
  'M12 2C6.48 2 2 5.9 2 10.7c0 4.3 3.6 7.9 8.4 8.6.3.06.7.2.8.46.1.24.06.6.03.85l-.13 1c-.04.3-.24 1.17 1.02.64 1.27-.53 6.83-4.02 9.32-6.88C22.9 13.55 24 12.2 24 10.7 24 5.9 17.52 2 12 2z'

const YOUTUBE_ICON_PATH =
  'M23 12s0-3.4-.4-5c-.3-1-1-1.8-2-2C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.6.5c-1 .2-1.7 1-2 2C1 8.6 1 12 1 12s0 3.4.4 5c.3 1 1 1.8 2 2 1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5c1-.2 1.7-1 2-2 .4-1.6.4-5 .4-5zM9.8 15.5v-7l6 3.5-6 3.5z'

export function Footer({ onLoginClick }: FooterProps) {
  return (
    <div className='bg-white px-6 pt-24 sm:px-12'>
      <div className='mx-auto max-w-300'>
        <div className='grid grid-cols-1 gap-10 border-b border-[#dee1e6] pb-14 sm:grid-cols-[1.4fr_1fr_1fr_1fr]'>
          <div>
            <div className='flex items-center gap-2.5'>
              <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0052ff] text-white'>
                <QrCode className='size-4.5' strokeWidth={2} />
              </div>
              <div className='text-[16px] font-semibold'>Baan Baan Kitchen</div>
            </div>
            <div className='mt-4 max-w-70 text-[14px] leading-normal text-[#5b616e]'>
              Scan-to-order system for restaurants — fewer staff, more sales,
              ready to use instantly.
            </div>
          </div>

          <div>
            <div className='mb-4 text-[13px] font-semibold text-[#0a0b0d]'>
              Product
            </div>
            <div className='flex flex-col gap-3'>
              <a
                href='#updates'
                className='text-[14px] text-[#5b616e] hover:text-[#0a0b0d]'
              >
                Updates
              </a>
            </div>
          </div>

          <div>
            <div className='mb-4 text-[13px] font-semibold text-[#0a0b0d]'>
              Account
            </div>
            <div className='flex flex-col gap-3'>
              <button
                onClick={onLoginClick}
                className='text-left text-[14px] text-[#5b616e] hover:text-[#0a0b0d]'
              >
                Login
              </button>
            </div>
          </div>

          <div>
            <div className='mb-4 text-[13px] font-semibold text-[#0a0b0d]'>
              Contact
            </div>
            <div className='flex flex-col gap-3 text-[14px] text-[#5b616e]'>
              <div>
                88 Sukhumvit Soi 24
                <br />
                Khlong Toei, Bangkok
              </div>
              <a href='tel:021234567' className='hover:text-[#0a0b0d]'>
                02-123-4567
              </a>
              <a
                href='mailto:hello@baansuankitchen.co.th'
                className='hover:text-[#0a0b0d]'
              >
                hello@baansuankitchen.co.th
              </a>
            </div>
          </div>
        </div>

        <div className='flex flex-col items-start justify-between gap-4 py-6 text-[13px] text-[#7c828a] sm:flex-row sm:items-center'>
          <div>© 2026 Baan Baan Kitchen. All rights reserved.</div>
          <div className='flex items-center gap-5'>
            <a
              href='https://line.me/'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1.5 hover:text-[#0a0b0d]'
            >
              <svg width='14' height='14' viewBox='0 0 24 24' fill='#06c755'>
                <path d={LINE_ICON_PATH} />
              </svg>
              LINE
            </a>
            <a
              href='https://youtube.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1.5 hover:text-[#0a0b0d]'
            >
              <svg width='14' height='14' viewBox='0 0 24 24' fill='#ff0000'>
                <path d={YOUTUBE_ICON_PATH} />
              </svg>
              YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
