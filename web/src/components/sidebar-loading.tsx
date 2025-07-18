import { SidebarMenu, SidebarMenuItem, SidebarMenuSkeleton } from './ui/sidebar'

export default function SidebarLoading({
  showIcon,
  length = 5,
}: {
  showIcon?: boolean
  length?: number
}) {
  return (
    <SidebarMenu>
      {Array.from({ length }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton showIcon={showIcon} />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
