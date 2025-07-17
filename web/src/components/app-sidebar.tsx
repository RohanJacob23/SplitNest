import { Link } from '@tanstack/react-router'
import { ChevronDown, CreditCard, DollarSign, Home } from 'lucide-react'
import { NavUser } from './nav-user'
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'

const applicationItems = [
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
]

const spaces = [
  {
    title: 'Space 1',
    url: '/space/1',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
  {
    title: 'Space 2',
    url: '/space/2',
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="h-16 justify-center border-b">
        <SidebarMenu>
          <SidebarMenuItem className="">
            <SidebarMenuButton
              asChild
              className="h-full text-lg font-semibold text-nowrap"
            >
              <Link to="/">
                <DollarSign />
                Split Nest
              </Link>
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
              {applicationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link to={item.url}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        isActive={isActive}
                        className="cursor-pointer"
                        tooltip={item.title}
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

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel>Your Spaces</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <CollapsibleTrigger>
                    Spaces
                    <ChevronDown className="transition-transformn ml-auto group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <CollapsibleContent animate={{ height: '384px' }}>
              <SidebarMenuSub>
                {spaces.map((space, i) => (
                  <SidebarMenuSubItem key={i}>
                    <SidebarMenuSubButton>{space.title}</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
