import {
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { useAppForm } from "@/hooks/form";
import { cn } from "@/lib/utils";
import { sleep } from "@/query/get-user";
import { orpc } from "@/utils/orpc";
import { Button } from "../ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import { Label } from "../ui/label";
import { ModalClose, ModalFooter } from "../ui/modal";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";

const newSubscriptionFormSchema = z.object({
	spaceId: z.number().min(1, { error: "Space is required" }),
	payerId: z.string().nonempty({ error: "Payer is required" }),
	name: z.string().nonempty({ error: "Name is required" }),
	amount: z.string().nonempty({ error: "Amount is required" }),
	dueDay: z.string().nonempty({ error: "Due day is required" }),
	splitMethod: z.object({
		type: z.enum(["equal", "custom"]),
		percentages: z.record(z.string(), z.number()).refine(
			(percentages) => {
				const sum = Object.values(percentages).reduce(
					(acc, val) => acc + val,
					0,
				);
				return sum >= 99 && sum <= 101; // allow a ±1% margin for rounding
			},
			{
				message: "Percentages must sum approximately to 100",
			},
		),
	}),
});

export default function NewSubscriptionForm() {
	const [open, setOpen] = useState(false);

	const { data: spaces } = useSuspenseQuery(orpc.spaces.get.all.queryOptions());

	const newSubscriptionMutation = useMutation(
		orpc.subscriptions.add.mutationOptions(),
	);

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: {
			spaceId: 0,
			payerId: "",
			name: "",
			amount: "",
			dueDay: "",
			splitMethod: {
				type: "equal" as "equal" | "custom",
				percentages: {} as Record<string, number>,
			},
		},
		validators: { onSubmit: newSubscriptionFormSchema },
		onSubmit: async ({ value: { amount, dueDay, ...rest } }) => {
			await sleep(1500);

			toast.promise(
				newSubscriptionMutation.mutateAsync({
					amount: Number(amount),
					dueDay: Number(dueDay),
					...rest,
				}),
				{
					loading: "Creating subscription...",
					success: ({ message }) => {
						queryClient.invalidateQueries({
							queryKey: orpc.subscriptions.listAll.key({
								input: { spaceId: rest.spaceId },
							}),
						});
						queryClient.invalidateQueries({
							queryKey: orpc.subscriptions.all.key(),
						});
						form.resetField;
						return message;
					},
					error: "Error creating subscription",
				},
			);
		},
	});

	const { data: members, isFetching } = useQuery(
		orpc.spaces.members.get.queryOptions({
			enabled: form.state.values.spaceId > 0,
			input: { spaceId: form.state.values.spaceId },
		}),
	);

	return (
		<form
			className="space-y-4 overflow-y-auto sm:max-h-[min(640px,80vh)]"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<div className="space-y-4 px-4">
				<form.AppField
					name="name"
					children={(field) => (
						<field.TextField label="Name" placeholder="example" />
					)}
				/>
				<form.AppField
					name="amount"
					children={(field) => (
						<field.TextField label="Amount" type="number" placeholder="xxxx" />
					)}
				/>
				<form.AppField
					name="dueDay"
					children={(field) => (
						<field.TextField
							label="Due Date"
							type="number"
							placeholder="1-31"
							min={1}
							max={31}
						/>
					)}
				/>

				<form.Field
					name="spaceId"
					children={(field) => (
						<Popover open={open} onOpenChange={setOpen}>
							<div className="*:not-first:mt-2">
								<Label htmlFor="space">Space</Label>
								<PopoverTrigger asChild>
									<Button
										id="space"
										variant="outline"
										role="combobox"
										aria-expanded={open}
										whileTap={{ scale: 1 }}
										className="w-full"
										spanClassname="w-full justify-between"
									>
										{field.state.value
											? spaces.find(
													(space) => space.spaceId === field.state.value,
												)?.space?.name
											: "Select Space..."}
										<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
							</div>
							<PopoverContent
								className="w-(--radix-popover-trigger-width) p-0"
								side="top"
							>
								<Command>
									<CommandInput placeholder="Search Space..." />
									<CommandList>
										<CommandEmpty>No space found.</CommandEmpty>
										<CommandGroup>
											{spaces.map((space) => (
												<CommandItem
													key={space.id}
													value={space.spaceId?.toString()}
													onSelect={(currentValue) => {
														// setValue(currentValue === value ? "" : currentValue)
														field.handleChange(Number(currentValue));
														setOpen(false);
													}}
												>
													<CheckIcon
														className={cn(
															"mr-2 size-4",
															field.state.value === space.spaceId
																? "opacity-100"
																: "opacity-0",
														)}
													/>
													{space.space?.name}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					)}
				/>

				<form.Field
					name="splitMethod.type"
					listeners={{
						onChange: ({ value }) => {
							if (value === "equal" && members) {
								const memberPercentage = 100 / members.length;

								const percentages = members.reduce(
									(acc, member) => {
										acc[member.userId] = memberPercentage;
										return acc;
									},
									{} as Record<string, number>,
								);

								form.setFieldValue("splitMethod.percentages", percentages);
							}
						},
					}}
					children={(field) => (
						<div className="grid gap-2">
							<Label>Split Method</Label>
							<RadioGroup
								value={field.state.value}
								onValueChange={(value: "custom" | "equal") =>
									field.handleChange(value)
								}
								disabled={!members}
								className="flex gap-2"
							>
								<div className="relative flex w-full items-start gap-2 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/25">
									<RadioGroupItem
										value="equal"
										id={`${field.name}-equal`}
										className="order-1 after:absolute after:inset-0"
									/>
									<div
										aria-disabled={!members}
										className="grid grow gap-2 aria-disabled:opacity-25"
									>
										<Label htmlFor={`${field.name}-equal`}>Equal</Label>
										<p className="text-muted-foreground text-xs">
											Split the amount equally between all members.
										</p>
									</div>
								</div>
								<div className="relative flex w-full items-start gap-2 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/25">
									<RadioGroupItem
										value="custom"
										id={`${field.name}-custom`}
										className="order-1 after:absolute after:inset-0"
									/>
									<div
										aria-disabled={!members}
										className="grid grow gap-2 aria-disabled:opacity-25"
									>
										<Label htmlFor={`${field.name}-custom`}>Custom</Label>
										<p className="text-muted-foreground text-xs">
											Split the amount manually between all members.
										</p>
									</div>
								</div>
							</RadioGroup>
						</div>
					)}
				/>

				{isFetching ? (
					<Skeleton className="h-16 w-full" />
				) : members ? (
					<>
						<form.Field
							name="payerId"
							children={(field) => (
								<div className="space-y-2">
									<Label>Payer</Label>
									<Select
										value={field.state.value.toString()}
										onValueChange={field.handleChange}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select members...">
												{
													members.find(
														(member) => member.userId === field.state.value,
													)?.user.name
												}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Members</SelectLabel>
												{members.map((member) => (
													<SelectItem key={member.id} value={member.userId}>
														{member.user.name}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									{!field.state.meta.isValid &&
										field.state.meta.errors.map((error, i) => (
											<span key={i} className="mt-2 text-destructive text-xs">
												{error?.message}
											</span>
										))}
								</div>
							)}
						/>

						<div className="space-y-2">
							<p>Split between members</p>
							<div className="space-y-4 rounded-lg border p-4">
								{members.map((member) => (
									<form.Subscribe
										key={member.id}
										selector={(state) => state.values.splitMethod.type}
										children={(type) => (
											<form.AppField
												name="splitMethod.percentages"
												listeners={{
													onMount: ({ fieldApi }) => {
														if (type === "equal") {
															const memberPercentage = 100 / members.length;

															const percentages = members.reduce(
																(acc, member) => {
																	acc[member.userId] = memberPercentage;
																	return acc;
																},
																{} as Record<string, number>,
															);

															fieldApi.setValue(percentages);
														}
													},
												}}
												children={(field) => (
													<field.TextField
														label={member.user.name}
														placeholder="Input percentage"
														type="number"
														value={field.state.value[member.userId]}
														onChange={(e) => {
															field.handleChange({
																...field.state.value,
																[member.userId]: Number(e.target.value),
															});
														}}
														disabled={type === "equal"}
														min={0}
														max={100}
													/>
												)}
											/>
										)}
									/>
								))}
							</div>
						</div>
					</>
				) : null}
			</div>

			<ModalFooter className="sticky bottom-0 bg-background p-4">
				<ModalClose asChild>
					<Button variant="outline" className="flex-1">
						Cancel
					</Button>
				</ModalClose>
				<form.AppForm>
					<form.SubmitButton
						label="Submit"
						className="flex-1"
						isLoading={newSubscriptionMutation.isPending}
					/>
				</form.AppForm>
			</ModalFooter>
		</form>
	);
}
