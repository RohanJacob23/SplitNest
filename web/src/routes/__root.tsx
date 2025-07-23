import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { getUser } from '@/query/get-user.ts'
import Error404 from '@/components/pages/error.tsx'

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
        toastOptions={{
          style: { paddingBlock: '0.75rem', paddingInline: '1rem' },
        }}
      />
    </ThemeProvider>
  ),
  notFoundComponent: Error404,
  errorComponent: ({ error }) => {
    // Render an error message
    return (
      <main className="grid min-h-screen place-content-center space-y-2 text-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
          Something went wrong!!
        </h1>
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          {error.message}
        </h2>
      </main>
    )
  },
})
