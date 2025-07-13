import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getUser } from '@/query/get-user'
import { Skeleton } from '../ui/skeleton'
import { ArrowRight } from 'lucide-react'
import { Suspense, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { cn } from '@/lib/utils'

const items = [
  {
    name: 'Features',
    to: '/',
    hash: 'features',
  },
  {
    name: 'Pricing',
    to: '/',
    hash: 'pricing',
  },
  {
    name: 'About',
    to: '/',
    hash: 'about',
  },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50)
  })

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-4 max-w-7xl translate-y-0 transition-[transform_max-width] duration-300 ease-in-out sm:mx-auto',
        isScrolled && 'max-w-5xl translate-y-2',
      )}
    >
      <nav
        className={cn(
          'bg-background/60 mx-auto flex h-16 max-w-7xl items-center justify-between px-6 backdrop-blur-3xl',
          isScrolled &&
            'border-primary/50 dark:border-primary/15 rounded-2xl border border-dashed',
        )}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            <div className="bg-background h-3 w-3 rounded-sm" />
          </div>
          <span className="text-xl font-medium">Split Nest</span>
        </div>

        <div className="hidden items-center space-x-8 md:flex">
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              hash={item.hash}
              className="text-muted-foreground hover:text-primary text-base font-medium transition-colors duration-300"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <Suspense fallback={<Skeleton className="h-9 w-24" />}>
          <AuthSection />
        </Suspense>
      </nav>
    </header>
  )
}

const AuthSection = () => {
  const { data } = useSuspenseQuery(getUser)

  if (data)
    return (
      <Button className="group gap-1" asChild>
        <Link to="/dashboard">
          Dashboard
          <ArrowRight className="transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </Link>
      </Button>
    )
  else
    return (
      <div className="space-x-2">
        <Button variant="outline" asChild>
          <Link to="/auth/login">Sign In</Link>
        </Button>
        <Button asChild>
          <Link to="/auth/sign-up">Get Started</Link>
        </Button>
      </div>
    )
}
