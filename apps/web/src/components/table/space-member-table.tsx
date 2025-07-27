import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { getUser } from "@/query/get-user";
import { orpc } from "@/utils/orpc";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

export default function SpaceMemberTable({ id }: { id: string }) {
	const { data: members } = useSuspenseQuery(
		orpc.spaces.members.get.queryOptions({ input: { spaceId: Number(id) } }),
	);
	const { data: user } = useSuspenseQuery(getUser);

	const deleteMemberMutation = useMutation(
		orpc.spaces.members.delete.mutationOptions(),
	);

	const queryClient = useQueryClient();

	const handleRemoveMember = (memberId: string) => {
		toast.promise(
			deleteMemberMutation.mutateAsync({ memberId: Number(memberId) }),
			{
				loading: "Removing member...",
				success: ({ message }) => {
					queryClient.invalidateQueries({
						queryKey: orpc.spaces.members.get.queryKey({
							input: { spaceId: Number(id) },
						}),
					});
					return message;
				},
				error: "Error removing member",
			},
		);
	};

	return (
		<Card>
			<CardContent className="grid">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead className="text-right">Balance</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{members.map((member) => (
							<TableRow key={member.id}>
								<TableCell>
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarFallback>{member.user?.name[0]}</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-medium">{member.user?.name}</div>
										</div>
									</div>
								</TableCell>
								<TableCell>{member.user?.email}</TableCell>
								<TableCell>{member.role}</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button size="icon" variant="ghost">
												<MoreHorizontal />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent side="bottom" align="end">
											{/* TODO: implement */}
											<DropdownMenuItem
												onClick={() => handleRemoveMember(member.id.toString())}
												disabled={
													user?.id !== member.space?.ownerId ||
													member.space?.ownerId === member.userId
												}
											>
												Remove
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
