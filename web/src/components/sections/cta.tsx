import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'

export default function Cta() {
  return (
    <section className="py-32">
      <div className="container">
        <div className="bg-accent flex w-full flex-col gap-16 overflow-hidden rounded-lg p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-12">
          <div className="flex-1">
            <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              Call to Action
            </h3>
            <p className="text-muted-foreground max-w-xl lg:text-lg">
              Build faster with our collection of pre-built blocks. Speed up
              your development and ship features in record time.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
