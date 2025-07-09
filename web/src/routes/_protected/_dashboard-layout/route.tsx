import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export const Route = createFileRoute('/_protected/_dashboard-layout')({
  component: RouteComponent,
})

function RouteComponent() {
  const { pathname } = useLocation()

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="grid flex-auto grid-rows-[auto_1fr]">
        <div className="flex h-16 items-center gap-2 border-b px-4 py-2">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-8"
          />
          <p className="capitalize">{pathname.split('/')[1]}</p>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
