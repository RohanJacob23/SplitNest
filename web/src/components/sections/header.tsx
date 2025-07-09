import { Button } from '../ui/button'

export default function Header() {
  return (
    <nav className="flex items-center justify-between border-b p-6 lg:px-12">
      <div className="flex items-center space-x-3">
        <div className="bg-foreground flex h-8 w-8 items-center justify-center rounded-lg">
          <div className="bg-background h-3 w-3 rounded-sm" />
        </div>
        <span className="text-xl font-medium">Split Nest</span>
      </div>

      <div className="hidden items-center space-x-8 md:flex">
        <a
          href="#features"
          className="text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          Features
        </a>
        <a
          href="#pricing"
          className="text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          Pricing
        </a>
        <a
          href="#about"
          className="text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          About
        </a>
      </div>

      <Button variant="outline">Sign In</Button>
    </nav>
  )
}
