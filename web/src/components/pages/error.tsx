import { Home, AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Link } from '@tanstack/react-router'

function Error404() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        {/* Error Icon */}
        <div className="mb-4 flex justify-center">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <AlertCircle className="h-8 w-8" />
          </div>
        </div>

        {/* 404 Number */}
        <h1 className="mb-4 text-8xl font-light tracking-tight">404</h1>

        {/* Error Message */}
        <div className="mb-10 space-y-3">
          <h2 className="text-2xl font-medium">Page Not Found</h2>
          <p className="leading-relaxed">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Error404
