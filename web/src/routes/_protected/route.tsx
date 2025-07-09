import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getUser } from '@/query/get-user'

export const Route = createFileRoute('/_protected')({
  loader: async ({ context }) => {
    const { data } = await context.queryClient.ensureQueryData(getUser)

    if (!data) throw redirect({ to: '/auth/login' })
  },
  component: Outlet,
})
