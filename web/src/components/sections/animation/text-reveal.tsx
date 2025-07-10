import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useEffect, type ReactNode } from 'react'
import { stagger, useAnimate } from 'motion/react'
import { slow } from '@/lib/easing'

gsap.registerPlugin(SplitText)

export default function TextReveal({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  const [scope, animate] = useAnimate()

  //   const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const split = new SplitText(scope.current, {
      type: 'words, lines',
      mask: 'lines',
    })

    animate(
      split.lines,
      {
        y: ['100%', '0%'],
        opacity: [0, 1],
        filter: ['blur(8px)', 'blur(0px)'],
      },
      {
        ...slow,
        delay: stagger(0.1, { startDelay: delay }),
      },
    )
  }, [])

  return (
    <span ref={scope} className="inline-block">
      {children}
    </span>
  )
}
