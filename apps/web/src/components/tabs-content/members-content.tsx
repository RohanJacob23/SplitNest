import { useSuspenseQuery } from "@tanstack/react-query";
import { Crown, User } from "lucide-react";
import { orpc } from "@/utils/orpc";
import SpaceMemberTable from "../table/space-member-table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

export default function MembersContent({ id }: { id: string }) {
	const { data: members } = useSuspenseQuery(
		orpc.spaces.members.get.queryOptions({ input: { spaceId: Number(id) } }),
	);

	return (
		<div className="space-y-2">
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
				<Card>
					<CardHeader className="flex gap-4">
						<User className="size-6 text-blue-500" />
						<div>
							<CardTitle>Total Members</CardTitle>
							<CardDescription>{members.length}</CardDescription>
						</div>
					</CardHeader>
				</Card>
				<Card>
					<CardContent className="flex gap-4">
						<Crown className="size-6 text-emerald-500" />
						<div>
							<CardTitle>Admins</CardTitle>
							<CardDescription>
								{members.filter((m) => m.role === "admin").length}
							</CardDescription>
						</div>
					</CardContent>
				</Card>
			</div>

			<SpaceMemberTable id={id} />
		</div>
	);
}
