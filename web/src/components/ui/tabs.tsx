import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { swift } from '@/lib/easing'

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

function TabsList({
  children,
  className,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const [isActivePosition, setIsActivePosition] = React.useState<string>()
  const isInitial = React.useRef(true)

  const localRef = React.useRef<HTMLDivElement>(null)

  React.useImperativeHandle(ref, () => localRef.current!)

  React.useEffect(() => {
    if (!localRef.current) return

    const observer = new MutationObserver(() => {
      if (!localRef.current) return

      const activeTab = localRef.current.querySelector<HTMLElement>(
        '[data-state="active"]',
      )
      if (!activeTab) return

      const container = localRef.current
      const { offsetLeft, offsetTop, offsetWidth } = activeTab

      const clipLeft = offsetLeft
      const clipRight = offsetLeft + offsetWidth

      const right = Number(100 - (clipRight / container.offsetWidth) * 100)
      const left = Number((clipLeft / container.offsetWidth) * 100)

      const value = `inset(${offsetTop}px ${Number(right)}% ${offsetTop}px ${Number(left)}% round 7px)`

      setIsActivePosition(value)

      if (isInitial) {
        isInitial.current = false
      }
    })

    observer.observe(localRef.current, {
      attributes: true,
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [])

  return (
    <TabsPrimitive.List
      ref={localRef}
      data-slot="tabs-list"
      className={cn(
        'bg-muted text-muted-foreground relative inline-flex w-fit items-center justify-center rounded-xl p-1',
        className,
      )}
      {...props}
    >
      {children}

      <motion.div
        initial={{ clipPath: 'inset(100%)' }}
        animate={{ clipPath: isActivePosition }}
        transition={swift}
        className="bg-primary *:text-primary-foreground absolute top-0 left-0 inline-flex size-full items-center justify-center rounded-lg p-1 *:pointer-events-none"
      >
        {children}
      </motion.div>
    </TabsPrimitive.List>
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-value={props.value}
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
