import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_dashboard-layout/setting')({
  component: RouteComponent,
})

// TODO: User Settings (/settings), Name, email, theme switch, Email notification toggle, Billing (upgrade to Pro)
function RouteComponent() {
  return (
    <section className="p-4">
      <h1>Settings page</h1>
    </section>
  )
}
