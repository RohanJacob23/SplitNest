import { createFileRoute, Link } from '@tanstack/react-router'
export const Route = createFileRoute('/')({
  component: App,
})

// TODO: This is the landing page
function App() {
  return (
    <main>
      <h1>Hello</h1>
      <Link to="/dashboard">Dashboard</Link>
    </main>
  )
}
