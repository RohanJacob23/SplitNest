import { getUser } from '@/query/get-user'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  loader: async ({ context }) => {
    const { data } = await context.queryClient.ensureQueryData(getUser)

    if (data) throw redirect({ to: '/dashboard' })
  },
  component: Outlet,
})
