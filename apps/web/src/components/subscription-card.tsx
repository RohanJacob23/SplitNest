// components/SubscriptionCard.tsx

import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SubscriptionProps } from "@/routes/_protected/_dashboard-layout/subscription";

export default function SubscriptionCard({
	icon: Icon,
	name,
	amount,
	dueDate,
	paidBy,
	status,
	// split,
}: SubscriptionProps) {
	return (
		<Card className="shadow-sm transition-all duration-300 hover:shadow-md">
			<CardContent className="space-y-2.5">
				<div className="flex items-center justify-between">
					<div className="text-3xl">
						<Icon />
					</div>
					<Badge variant="secondary">{status}</Badge>
				</div>

				<div>
					<h2 className="font-semibold text-lg">{name}</h2>
					<p className="text-muted-foreground text-sm">{amount}</p>
				</div>

				<div className="space-y-1 text-muted-foreground text-sm">
					<p>
						<span className="font-medium">Due:</span> {dueDate}
					</p>
					<p>
						<span className="font-medium">Paid By:</span> {paidBy}
					</p>
					<p>
						<span className="font-medium">Split:</span> {0}
					</p>
				</div>

				<div className="flex gap-2 pt-2">
					<Button
						variant="outline"
						size="sm"
						className="flex items-center gap-1"
					>
						<Pencil size={14} />
						Edit
					</Button>
					<Button
						variant="destructive"
						size="sm"
						className="flex items-center gap-1"
					>
						<Trash2 size={14} />
						Delete
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
