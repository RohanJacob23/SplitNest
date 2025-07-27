import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute(
	"/_protected/_dashboard-layout/notification",
)({
	loader: async ({ context: { orpc, queryClient } }) =>
		await queryClient.ensureQueryData(orpc.invites.get.queryOptions()),
	component: RouteComponent,
});

function RouteComponent() {
	const { data: notifications } = useSuspenseQuery(
		orpc.invites.get.queryOptions(),
	);

	const queryClient = useQueryClient();

	const acceptInviteMutation = useMutation(
		orpc.invites.accept.mutationOptions(),
	);
	const declineInviteMutation = useMutation(
		orpc.invites.decline.mutationOptions(),
	);

	const handleAccept = (id: number) => {
		toast.promise(acceptInviteMutation.mutateAsync({ inviteId: id }), {
			loading: "Accepting invite...",
			success: ({ message }) => {
				queryClient.invalidateQueries({
					queryKey: orpc.invites.get.queryKey(),
				});
				queryClient.invalidateQueries({
					queryKey: orpc.spaces.get.all.queryKey(),
				});

				return message;
			},
			error: "Error accepting invite",
		});
	};

	const handleDecline = (id: number) => {
		toast.promise(declineInviteMutation.mutateAsync({ inviteId: id }), {
			loading: "Declining invite...",
			success: ({ message }) => {
				queryClient.invalidateQueries({
					queryKey: orpc.invites.get.queryKey(),
				});

				return message;
			},
			error: "Error declining invite",
		});
	};

	return (
		<section className="mx-auto w-full max-w-7xl space-y-6 p-4">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-2xl">
						<Bell className="size-5 text-emerald-500" /> Notifications
					</CardTitle>
				</CardHeader>
				<CardContent className="border-t pt-4">
					{notifications.length === 0 && (
						<h1 className="text-muted-foreground text-xl">No notifications</h1>
					)}

					{notifications.map((notif) => (
						<Card key={notif.id}>
							<CardHeader className="flex flex-col items-center justify-between gap-2 sm:flex-row">
								<div className="space-y-2">
									<CardTitle>Space: {notif.space.name}</CardTitle>
									<CardDescription>
										Adimin:{" "}
										<span className="inline-flex gap-1">
											<span>{notif.space.owner?.name}</span>
											<span>{notif.space.owner?.email}</span>
										</span>
									</CardDescription>
								</div>
								<div className="flex gap-2">
									<Button
										size="sm"
										disabled={
											acceptInviteMutation.isPending ||
											declineInviteMutation.isPending
										}
										onClick={() => handleAccept(notif.id)}
									>
										Accept
									</Button>
									<Button
										size="sm"
										variant="outline"
										disabled={
											acceptInviteMutation.isPending ||
											declineInviteMutation.isPending
										}
										onClick={() => handleDecline(notif.id)}
									>
										Decline
									</Button>
								</div>
							</CardHeader>
						</Card>
					))}
				</CardContent>
			</Card>
		</section>
	);
}
