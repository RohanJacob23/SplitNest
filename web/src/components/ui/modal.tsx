import { useIsMobile } from '@/hooks/use-mobile'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
} from './drawer'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from './dialog'
import type { ComponentProps } from 'react'

function Modal(props: ComponentProps<typeof Drawer | typeof Dialog>) {
  const isMobile = useIsMobile()

  if (isMobile) return <Drawer {...props} />
  else return <Dialog {...props} />
}

function ModalTrigger(
  props: ComponentProps<typeof DrawerTrigger | typeof DialogTrigger>,
) {
  const isMobile = useIsMobile()

  if (isMobile) return <DrawerTrigger {...props} />
  else return <DialogTrigger {...props} />
}

function ModalContent(
  props: ComponentProps<typeof DrawerContent | typeof DialogContent>,
) {
  const isMobile = useIsMobile()

  if (isMobile) return <DrawerContent {...props} />
  else return <DialogContent {...props} />
}

function ModalHeader(
  props:
    | ComponentProps<typeof DrawerHeader>
    | ComponentProps<typeof DialogHeader>,
) {
  const isMobile = useIsMobile()

  if (isMobile) return <DrawerHeader {...props} />
  else return <DialogHeader {...props} />
}

function ModalTitle(
  props:
    | ComponentProps<typeof DrawerTitle>
    | ComponentProps<typeof DialogTitle>,
) {
  const isMobile = useIsMobile()

  if (isMobile) return <DrawerTitle {...props} />
  else return <DialogTitle {...props} />
}

function ModalDescription(
  props:
    | ComponentProps<typeof DrawerDescription>
    | ComponentProps<typeof DialogDescription>,
) {
  const isMobile = useIsMobile()

  if (isMobile) return <DrawerDescription {...props} />
  else return <DialogDescription {...props} />
}

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
}
