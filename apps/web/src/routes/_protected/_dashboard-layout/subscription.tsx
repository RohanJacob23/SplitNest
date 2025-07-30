import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Car,
	Coffee,
	Gamepad2,
	Music,
	Plus,
	Search,
	Video,
	Wifi,
} from "lucide-react";
import { useState } from "react";
import NewSubscriptionForm from "@/components/form/new-subscription-form";
import SubscriptionCard from "@/components/subscription-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { orpc, type Subscription } from "@/utils/orpc";

export const Route = createFileRoute(
	"/_protected/_dashboard-layout/subscription",
)({
	loader: ({ context: { orpc, queryClient } }) =>
		queryClient.ensureQueryData(orpc.subscriptions.all.queryOptions()),
	component: SubscriptionsPage,
});

// Mock data for subscriptions
const mockSubscriptions = [
	{
		id: 1,
		name: "Netflix",
		icon: Video,
		amount: 15.99,
		dueDate: "2024-01-15",
		paidBy: "Alex",
		status: "active",
		splitPercentage: 50,
		category: "Entertainment",
		paymentHistory: [
			{ month: "December 2023", paid: true, paidBy: "Alex", amount: 15.99 },
			{ month: "November 2023", paid: true, paidBy: "Sarah", amount: 15.99 },
			{ month: "October 2023", paid: true, paidBy: "Alex", amount: 15.99 },
		],
	},
	{
		id: 2,
		name: "Spotify Premium",
		icon: Music,
		amount: 9.99,
		dueDate: "2024-01-08",
		paidBy: "Sarah",
		status: "active",
		splitPercentage: 50,
		category: "Entertainment",
		paymentHistory: [
			{ month: "December 2023", paid: true, paidBy: "Sarah", amount: 9.99 },
			{ month: "November 2023", paid: true, paidBy: "Alex", amount: 9.99 },
			{ month: "October 2023", paid: false, paidBy: "Sarah", amount: 9.99 },
		],
	},
	{
		id: 3,
		name: "Internet",
		icon: Wifi,
		amount: 79.99,
		dueDate: "2024-01-20",
		paidBy: "Alex",
		status: "active",
		splitPercentage: 50,
		category: "Utilities",
		paymentHistory: [
			{ month: "December 2023", paid: true, paidBy: "Alex", amount: 79.99 },
			{ month: "November 2023", paid: true, paidBy: "Alex", amount: 79.99 },
			{ month: "October 2023", paid: true, paidBy: "Sarah", amount: 79.99 },
		],
	},
	{
		id: 4,
		name: "PlayStation Plus",
		icon: Gamepad2,
		amount: 9.99,
		dueDate: "2024-01-12",
		paidBy: "Sarah",
		status: "inactive",
		splitPercentage: 100,
		category: "Entertainment",
		paymentHistory: [
			{ month: "November 2023", paid: true, paidBy: "Sarah", amount: 9.99 },
			{ month: "October 2023", paid: true, paidBy: "Sarah", amount: 9.99 },
		],
	},
	{
		id: 5,
		name: "Coffee Subscription",
		icon: Coffee,
		amount: 24.99,
		dueDate: "2024-01-05",
		paidBy: "Alex",
		status: "active",
		splitPercentage: 75,
		category: "Food",
		paymentHistory: [
			{ month: "December 2023", paid: true, paidBy: "Alex", amount: 24.99 },
			{ month: "November 2023", paid: true, paidBy: "Alex", amount: 24.99 },
		],
	},
	{
		id: 6,
		name: "Car Insurance",
		icon: Car,
		amount: 156.0,
		dueDate: "2024-01-25",
		paidBy: "Sarah",
		status: "active",
		splitPercentage: 50,
		category: "Insurance",
		paymentHistory: [
			{ month: "December 2023", paid: true, paidBy: "Sarah", amount: 156.0 },
			{ month: "November 2023", paid: true, paidBy: "Alex", amount: 156.0 },
		],
	},
];
export default function SubscriptionsPage() {
	const { data: subscriptions } = useSuspenseQuery(
		orpc.subscriptions.all.queryOptions(),
	);

	// TODO: work on filter
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const filteredSubscriptions = mockSubscriptions.filter((subscription) => {
		const matchesSearch = subscription.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || subscription.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<div>
						<h1 className="mb-2 font-bold text-3xl">Subscriptions</h1>
						<p>Manage your shared subscriptions with ease</p>
					</div>
					<Modal>
						<ModalTrigger asChild>
							<Button className="">
								<Plus className="mr-2 h-4 w-4" />
								Add Subscription
							</Button>
						</ModalTrigger>
						<ModalContent className="overflow-hidden p-0">
							<ModalHeader className="px-4 pt-4">
								<ModalTitle>Add Subscription</ModalTitle>
								<ModalDescription>Add a new subscription</ModalDescription>
							</ModalHeader>
							<NewSubscriptionForm />
						</ModalContent>
					</Modal>
				</div>

				{/* Filters */}
				<div className="mb-8 flex flex-col gap-4 sm:flex-row">
					<div className="relative flex-1">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform" />
						<Input
							placeholder="Search subscriptions..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Subscriptions</SelectItem>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="inactive">Inactive</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-4">
					<h1 className="scroll-m-20 font-semibold text-2xl tracking-tight">
						All Subscriptions
					</h1>

					{subscriptions.length === 0 ? (
						<p className="text-muted-foreground text-xl">No Subscriptions</p>
					) : (
						// subscription card
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
							{subscriptions.map((subscription) => (
								<SubscriptionCard key={subscription.id} {...subscription} />
							))}
						</div>
					)}
				</div>

				{/* Empty State */}
				{filteredSubscriptions.length === 0 && (
					<div className="py-12 text-center">
						<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
							<Search className="h-8 w-8 text-muted-foreground" />
						</div>
						<h3 className="mb-2 font-semibold text-lg">
							No subscriptions found
						</h3>
						<p className="mb-4">Try adjusting your search or filter criteria</p>
						<Button
							variant="outline"
							onClick={() => {
								setSearchTerm("");
								setStatusFilter("all");
							}}
						>
							Clear Filters
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
