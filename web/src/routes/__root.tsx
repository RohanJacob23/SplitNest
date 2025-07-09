import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { Loader } from 'lucide-react'
import { getUser } from '@/query/get-user.ts'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: ({ context }) => {
    context.queryClient.prefetchQuery(getUser)
  },
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="split-nest-theme">
      <Outlet />
      <TanStackRouterDevtools />

      <TanStackQueryLayout />
      <Toaster
        richColors
        closeButton
        icons={{ loading: <Loader className="size-4 animate-spin" /> }}
      />
    </ThemeProvider>
  ),
})
