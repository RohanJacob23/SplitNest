import { Card, CardContent } from '../ui/card'
import { Shield, Users, Zap } from 'lucide-react'
import TextReveal from './animation/text-reveal'
import { motion, stagger } from 'motion/react'
import { slow } from '@/lib/easing'

const features = [
  {
    icon: Zap,
    title: 'Fast',
    description: 'Lightning-fast data processing with optimized algorithms.',
  },
  {
    icon: Shield,
    title: 'Secure',
    description: 'Enterprise-grade security for your sensitive data.',
  },
  {
    icon: Users,
    title: 'Collaborative',
    description: 'Seamless team collaboration in real-time.',
  },
]

const MotionCard = motion.create(Card)

export default function Features() {
  return (
    <section id="features" className="bg-muted/30 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            <TextReveal>Built for modern teams</TextReveal>
          </h1>
          <p className="text-muted-foreground text-xl">
            <TextReveal>
              Everything you need to organize, split, and manage your data
              efficiently.
            </TextReveal>
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -25%' }}
          transition={{ delayChildren: stagger(0.2) }}
          className="grid gap-8 md:grid-cols-3"
        >
          {features.map((feature) => (
            <MotionCard
              variants={{
                hidden: { opacity: 0, y: 25, filter: 'blur(8px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
              }}
              transition={slow}
              key={feature.title}
            >
              <CardContent>
                <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-xl">
                  <feature.icon className="text-foreground size-6" />
                </div>
                <h3 className="text-2xl font-medium">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light">
                  {feature.description}
                </p>
              </CardContent>
            </MotionCard>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
