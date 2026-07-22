import { Input } from '@/src/components/ui/input'
import { Checkbox } from '@/src/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/components/ui/dialog'

type LoginDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignIn: () => void
  onGoogleSignIn: () => void
  signingIn: boolean
}

export function LoginDialog({
  open,
  onOpenChange,
  onSignIn,
  onGoogleSignIn,
  signingIn,
}: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={onGoogleSignIn}
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
          <a href='#' className='font-semibold text-[#0052ff] hover:underline'>
            Forgot Password?
          </a>
        </div>

        <button
          onClick={onSignIn}
          disabled={signingIn}
          className='w-full rounded-full bg-[#0052ff] py-4 text-[16px] font-semibold text-white disabled:opacity-50'
        >
          {signingIn ? 'Signing in…' : 'Sign In'}
        </button>
      </DialogContent>
    </Dialog>
  )
}
