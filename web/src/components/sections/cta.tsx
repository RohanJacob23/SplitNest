import { Button } from '../ui/button'
import { Input } from '../ui/input'

export default function Cta() {
  return (
    <section className="bg-muted/30 px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-6 text-4xl font-light md:text-5xl">
          Ready to get <span className="font-medium">started?</span>
        </h2>
        <p className="text-muted-foreground mb-12 text-xl font-light">
          Join thousands of teams already using Split Nest to organize their
          data.
        </p>

        <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
          <Input placeholder="Enter your email" className="px-6 py-6 text-lg" />
          <Button className="px-8 py-6 text-lg font-medium">Start Free</Button>
        </div>

        <p className="text-muted-foreground mt-6 text-sm font-light">
          No credit card required • 14-day free trial
        </p>
      </div>
    </section>
  )
}
