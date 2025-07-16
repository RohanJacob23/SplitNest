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
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'bg-muted text-muted-foreground relative inline-flex w-fit items-center justify-center rounded-xl p-1',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  children,
  ref,
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const [isActive, setIsActive] = React.useState(false)

  const localRef = React.useRef<HTMLButtonElement>(null)

  React.useImperativeHandle(ref, () => localRef.current as HTMLButtonElement)

  React.useEffect(() => {
    if (!localRef.current) return

    const observer = new MutationObserver(() => {
      if (!localRef.current) return

      const activeTab = localRef.current.dataset.state

      setIsActive(activeTab === 'active')
    })

    observer.observe(localRef.current, {
      attributes: true,
      attributeFilter: ['data-state'],
    })

    const activeTab = localRef.current.dataset.state

    setIsActive(activeTab === 'active')

    return () => observer.disconnect()
  }, [])

  return (
    <TabsPrimitive.Trigger
      ref={localRef}
      data-slot="tabs-trigger"
      data-value={props.value}
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 text-muted-foreground/70 data-[state=active]:text-foreground focus-visible:outline-ring dark:data-[state=active]:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium whitespace-nowrap focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="relative z-20">{children}</span>
      {isActive && (
        <motion.div
          layoutId="active-tab-indicator"
          transition={swift}
          className="dark:border-input bg-background dark:bg-input/30 absolute right-0 bottom-0 left-0 z-10 size-full rounded-lg border"
        />
      )}
    </TabsPrimitive.Trigger>
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
