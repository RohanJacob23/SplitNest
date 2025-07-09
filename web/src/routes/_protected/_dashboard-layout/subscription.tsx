import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/_dashboard-layout/subscription',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="p-4">
      <h1>Hello</h1>
    </section>
  )
}
