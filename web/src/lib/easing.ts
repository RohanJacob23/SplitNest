import type { Transition } from 'motion/react'

export const swift: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 18,
  mass: 0.3,
}
