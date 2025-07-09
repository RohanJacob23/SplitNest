import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_dashboard-layout/dashboard')(
  {
    component: RouteComponent,
  },
)
// TODO: List of all subscriptions, Total monthly cost, Who paid what (and owes what), Button to “Add Subscription
function RouteComponent() {
  return (
    <section className="p-4">
      <h1>Hello</h1>
    </section>
  )
}
