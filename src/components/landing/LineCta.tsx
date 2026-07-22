'use client'

export function LineCta() {
  return (
    <div className='bg-[#0a0b0d] px-6 py-24 text-center text-white sm:px-12'>
      <div className='mx-auto max-w-180'>
        <div className='text-[44px] leading-[1.09] font-normal tracking-[-1px]'>
          Get every update on LINE
        </div>
        <div className='mt-3 text-[16px] text-[#a8acb3]'>
          Promotions, new menus and restaurant news delivered to you.
        </div>
        <div className='mt-8 flex flex-wrap justify-center gap-3'>
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
    </div>
  )
}
