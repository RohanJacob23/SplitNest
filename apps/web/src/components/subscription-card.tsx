// components/SubscriptionCard.tsx

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { orpc, type Subscription as SubscriptionProps } from "@/utils/orpc";

export default function SubscriptionCard(props: SubscriptionProps) {
	const deleteSubscriptionMutation = useMutation(
		orpc.subscriptions.delete.mutationOptions(),
	);

	const queryClient = useQueryClient();

	const handleDelete = async () => {
		toast.promise(
			deleteSubscriptionMutation.mutateAsync({ subscriptionId: props.id }),
			{
				loading: "Deleting subscription...",
				success: ({ message }) => {
					queryClient.invalidateQueries({
						queryKey: orpc.subscriptions.all.key(),
					});
					return message;
				},
				error: "Error deleting subscription",
			},
		);
	};

	return (
		<Card className="shadow-sm transition-all duration-300 hover:shadow-md">
			<CardContent className="space-y-2.5">
				<div className="flex items-center justify-between">
					<div className="text-3xl">
						<DollarSign className="size-6" />
					</div>
					{/* <Badge variant="outline" className="gap-1.5 rounded-full capitalize">
						<span
							className={cn(
								"size-1.5 rounded-full",
								status === "active" ? "bg-emerald-500" : "bg-yellow-500",
							)}
							aria-hidden="true"
						/>
						{props.}
					</Badge> */}
				</div>

				<div>
					<h2 className="font-semibold text-lg">{props.name}</h2>
					<p className="text-muted-foreground text-sm">{props.amount}</p>
				</div>

				<div className="space-y-1 text-muted-foreground text-sm">
					<p>
						<span className="font-medium">Due:</span> {props.dueDay}
					</p>
					<p>
						<span className="font-medium">Paid By:</span> {props.payer.name}
					</p>
					<p>
						<span className="font-medium">Split:</span> {0}
					</p>
				</div>

				<div className="flex gap-2 pt-2">
					<Button
						variant="outline"
						size="sm"
						className="flex flex-1 items-center gap-1"
						disabled={deleteSubscriptionMutation.isPending}
					>
						<Pencil size={14} />
						Edit
					</Button>
					<Button
						variant="destructive"
						size="sm"
						className="flex flex-1 items-center gap-1"
						isLoading={deleteSubscriptionMutation.isPending}
						onClick={handleDelete}
					>
						<Trash2 size={14} />
						Delete
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
