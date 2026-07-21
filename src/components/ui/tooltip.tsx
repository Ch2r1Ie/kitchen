'use client'

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'

import { cn } from '@/src/lib/utils'

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot='tooltip-provider'
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot='tooltip' {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />
}

function TooltipContent({
  className,
  sideOffset = 8,
  children,
  hidden,
  ...props
}: TooltipPrimitive.Popup.Props &
  TooltipPrimitive.Positioner.Props & { hidden?: boolean }) {
  if (hidden) return null

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner sideOffset={sideOffset} {...props}>
        <TooltipPrimitive.Popup
          data-slot='tooltip-content'
          className={cn(
            'z-50 w-fit rounded-md bg-primary px-3 py-1.5 text-xs text-balance text-primary-foreground transition-[transform,opacity] data-ending-style:opacity-0 data-starting-style:opacity-0',
            className,
          )}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
