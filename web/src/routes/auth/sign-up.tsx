import SignUpForm from '@/components/form/sign-up-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="grid min-h-screen place-items-center p-2">
      <SignUpForm className="w-full max-w-sm" />
    </main>
  )
}
