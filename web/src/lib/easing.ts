import type { Transition } from 'motion/react'

export const swift: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 18,
  mass: 0.3,
}

export const snap: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 20,
  mass: 0.4,
}

export const elegant: Transition = {
  type: 'spring',
  stiffness: 150,
  damping: 19,
  mass: 1.2,
}
