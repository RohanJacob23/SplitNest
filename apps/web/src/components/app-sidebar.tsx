import { Link } from "@tanstack/react-router";
import { CreditCard, DollarSign, Home, Plus } from "lucide-react";
import { Suspense } from "react";
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
	SidebarSeparator,
} from "@/components/ui/sidebar";
import NewSpaceForm from "./form/new-space-form";
import { NavUser } from "./nav-user";
import SidebarLoading from "./sidebar-loading";
import SpacesSidebar from "./spaces-sidebar";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "./ui/modal";
import { Separator } from "./ui/separator";

const applicationItems = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: Home,
	},
	{
		title: "Subscription",
		url: "/subscription",
		icon: CreditCard,
	},
];

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon" className="border-r">
			<SidebarHeader className="h-16 justify-center border-b">
				<SidebarMenu>
					<SidebarMenuItem className="">
						<SidebarMenuButton
							asChild
							className="h-full text-nowrap font-semibold text-lg"
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
	);
}
