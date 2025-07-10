import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ArrowRight, CirclePlay, Star } from 'lucide-react'
import TextReveal from './animation/text-reveal'
import { motion } from 'motion/react'
import { slow } from '@/lib/easing'

const MotionBadge = motion.create(Badge)

export default function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          className="overflow-y-clip"
        >
          <MotionBadge
            variants={{
              hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={slow}
            variant="outline"
          >
            <Star className="size-4 fill-yellow-500 text-yellow-500" />
            Just released v1.0.0
          </MotionBadge>
        </motion.div>
        <h1 className="mt-6 text-4xl font-bold sm:text-5xl md:text-6xl md:leading-[1.2]">
          <TextReveal>Customized Shadcn UI Blocks & Components</TextReveal>
        </h1>
        <p className="mt-6 text-[17px] md:text-lg">
          <TextReveal delay={0.25}>
            Explore a collection of Shadcn UI blocks and components, ready to
            preview and copy. Streamline your development workflow with
            easy-to-implement examples.
          </TextReveal>
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          className="overflow-y-clip"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={{ ...slow, delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <Button size="lg">
              Get Started <ArrowRight className="size-5" />
            </Button>
            <Button variant="outline" size="lg">
              <CirclePlay className="size-5" /> Watch Demo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
