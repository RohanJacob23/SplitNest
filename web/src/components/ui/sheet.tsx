import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  motion,
  AnimatePresence,
  type TargetAndTransition,
  useDragControls,
} from 'motion/react'
import { elegant, swift } from '@/lib/easing'

interface SheetContextType {
  open: boolean
  setOpen: (value: boolean) => void
}

const SheetContext = React.createContext<SheetContextType | undefined>(
  undefined,
)

const useSheetContext = () => {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error('useSheetContext must be used within a SheetProvider')
  }
  return context
}

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  const [isOpen, setIsOpen] = React.useState(
    props?.open ?? props?.defaultOpen ?? false,
  )

  React.useEffect(() => {
    if (props?.open !== undefined) setIsOpen(props.open)
  }, [props?.open])

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open)
      props.onOpenChange?.(open)
    },
    [props],
  )

  return (
    <SheetContext.Provider
      value={{ open: isOpen, setOpen: handleOpenChange }}
      children={
        <SheetPrimitive.Root
          data-slot="sheet"
          onOpenChange={handleOpenChange}
          {...props}
        />
      }
    />
  )
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className,
      )}
      {...props}
    />
  )
}

const hidden: { [key: string]: TargetAndTransition } = {
  left: { x: '-100%', transition: swift },
  // left: { x: 'calc(-100% - 0.75rem)', transition: swift },
  right: { x: '100%', transition: swift },
  top: { y: '-100%', transition: swift },
  bottom: { y: '100%', transition: swift },
}

const visible: { [key: string]: TargetAndTransition } = {
  left: { x: '0%', transition: elegant },
  right: { x: '0%', transition: elegant },
  top: { y: '0%', transition: elegant },
  bottom: { y: '0%', transition: elegant },
}

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  const { open, setOpen } = useSheetContext()

  const controls = useDragControls()

  return (
    <AnimatePresence>
      {open && (
        <SheetPortal forceMount>
          <SheetOverlay
            asChild
            children={
              <motion.div
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              />
            }
          />
          <SheetPrimitive.Content
            asChild
            data-slot="sheet-content"
            className={cn(
              'fixed z-50 p-1.5',
              side === 'right' && 'inset-y-0 right-0 w-3/4 max-w-xs',
              side === 'left' && 'inset-y-0 left-0 w-3/4 max-w-xs',
              side === 'top' && 'inset-x-0 top-0 h-auto',
              side === 'bottom' && 'inset-x-0 bottom-0 h-auto',
            )}
            // className={cn(
            //   'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
            //   side === 'right' &&
            //     'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
            //   side === 'left' &&
            //     'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
            //   side === 'top' &&
            //     'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
            //   side === 'bottom' &&
            //     'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
            //   className,
            // )}

            {...props}
          >
            <motion.div
              initial={hidden[side]}
              animate={visible[side]}
              exit={hidden[side]}
              drag="x"
              dragControls={controls}
              dragListener={false}
              dragConstraints={{ left: 0, right: 0 }}
              whileDrag={{ scale: 0.98 }}
              dragElastic={{ left: 0.3, right: 0.1 }}
              onDragEnd={(_, { offset }) => setOpen(offset.x > -100)}
            >
              <div
                className={cn(
                  'bg-background relative flex h-full flex-col gap-4 rounded-lg border pr-3 shadow-xl',
                  className,
                )}
              >
                {children}
                <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
                  <XIcon className="size-4" />
                  <span className="sr-only">Close</span>
                </SheetPrimitive.Close>

                <div
                  onPointerDown={(e) => controls.start(e)}
                  style={{ touchAction: 'none' }}
                  className="bg-accent absolute top-1/2 right-0 mr-1 h-24 w-2 -translate-y-1/2 rounded-full hover:cursor-grab"
                />
              </div>
            </motion.div>
          </SheetPrimitive.Content>
        </SheetPortal>
      )}
    </AnimatePresence>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 p-4', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
