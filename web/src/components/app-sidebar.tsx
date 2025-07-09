import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Home, Calendar, Search, CreditCard } from 'lucide-react'
import { NavUser } from './nav-user'

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Subscription',
    url: '/subscription',
    icon: CreditCard,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
    disabled: true,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
    disabled: true,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-16 justify-center border-b">
        <SidebarMenu>
          <SidebarMenuItem className="">
            <SidebarMenuButton asChild className="h-full text-lg font-semibold">
              <Link to="/">Split Nest</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* <SidebarSeparator /> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link to={item.url} disabled={item.disabled}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        isActive={isActive}
                        className="cursor-pointer"
                        disabled={item.disabled}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
