import { Button } from '../ui/button'
import { ArrowDown, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto max-w-4xl">
        <div className="bg-muted text-muted-foreground mb-8 inline-flex items-center rounded-full px-4 py-2 text-sm">
          ✨ Introducing Split Nest v2.0
        </div>

        <h1 className="mb-6 text-5xl leading-tight font-light md:text-7xl">
          Data organization
          <br />
          <span className="font-medium">made simple</span>
        </h1>

        <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-xl font-light md:text-2xl">
          Transform complex data into organized, nested structures with
          intelligent splitting algorithms.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button className="px-8 py-6 text-lg font-medium">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="ghost" className="px-8 py-6 text-lg font-medium">
            View Demo
          </Button>
        </div>
      </div>

      <div className="absolute bottom-12">
        <ArrowDown className="text-muted-foreground h-5 w-5" />
      </div>
    </section>
  )
}
