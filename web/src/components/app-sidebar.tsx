import { Link } from '@tanstack/react-router'
import {
  ChevronDown,
  CreditCard,
  DollarSign,
  Home,
  LayoutGrid,
  Plus,
} from 'lucide-react'
import { NavUser } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from './ui/modal'
import NewSpaceForm from './form/new-space-form'
import { Separator } from './ui/separator'
import SpacesSidebar from './spaces-sidebar'
import { Suspense } from 'react'
import SidebarLoading from './sidebar-loading'

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

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Your Spaces</SidebarGroupLabel>
          <Modal>
            <SidebarGroupAction asChild title="Add Spaces">
              <ModalTrigger>
                <Plus /> <span className="sr-only">Add Spaces</span>
              </ModalTrigger>
            </SidebarGroupAction>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Add Spaces</ModalTitle>
              </ModalHeader>
              <Separator className="hidden md:block" />
              <NewSpaceForm />
            </ModalContent>
          </Modal>

          <Suspense fallback={<SidebarLoading length={1} showIcon={false} />}>
            <SpacesSidebar />
          </Suspense>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
