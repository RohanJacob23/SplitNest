import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { swift } from '@/lib/easing'
import { cn } from '@/lib/utils'

const CollapsibleContext = createContext<{ isOpen: boolean } | undefined>(
  undefined,
)

const useCollapsible = () => {
  const context = useContext(CollapsibleContext)
  if (!context) {
    throw new Error('useCollapsible must be used within a Collapsible')
  }
  return context
}

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  const [isOpen, setIsOpen] = useState(
    props?.open ?? props?.defaultOpen ?? false,
  )

  useEffect(() => {
    if (props?.open !== undefined) setIsOpen(props.open)
  }, [props?.open])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      props.onOpenChange?.(open)
    },
    [props],
  )
  return (
    <CollapsibleContext.Provider value={{ isOpen }}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        onOpenChange={handleOpenChange}
        {...props}
      />
    </CollapsibleContext.Provider>
  )
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

const MotionCollapsibleContent = motion.create(
  CollapsiblePrimitive.CollapsibleContent,
)

function CollapsibleContent({
  className,
  animate = { height: 'auto' },
  ...props
}: React.ComponentProps<typeof MotionCollapsibleContent>) {
  const { isOpen } = useCollapsible()

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <MotionCollapsibleContent
          forceMount
          data-slot="collapsible-content"
          initial={{ height: '0px' }}
          animate={animate}
          exit={{ height: '0px' }}
          transition={swift}
          className={cn('overflow-y-scroll', className)}
          {...props}
        />
      )}
    </AnimatePresence>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
