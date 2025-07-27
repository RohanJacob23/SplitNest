import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod/v4";
import { useAppForm } from "@/hooks/form";
import { orpc } from "@/utils/orpc";
import { Button } from "../ui/button";
import { ModalClose, ModalFooter } from "../ui/modal";

export default function NewSpaceForm() {
	const queryClient = useQueryClient();

	const createSpaceMutation = useMutation(orpc.spaces.create.mutationOptions());

	const form = useAppForm({
		defaultValues: { name: "" },
		validators: {
			onSubmit: z.object({
				name: z.string().min(1, { error: "Name is required" }),
			}),
		},
		onSubmit: async ({ value }) => {
			toast.promise(createSpaceMutation.mutateAsync(value), {
				loading: "Creating space...",
				success: ({ message }) => {
					queryClient.invalidateQueries({
						queryKey: orpc.spaces.get.all.queryKey(),
					});

					form.reset();

					return message;
				},
				error: (err) => err.message,
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			<form.AppField
				name="name"
				children={(field) => <field.TextField label="Name" />}
			/>

			<ModalFooter>
				<ModalClose asChild>
					<Button type="button" variant="outline" className="flex-1">
						Cancel
					</Button>
				</ModalClose>

				<form.AppForm>
					<form.SubmitButton
						label="Submit"
						className="flex-1"
						isLoading={createSpaceMutation.isPending}
					/>
				</form.AppForm>
			</ModalFooter>
		</form>
	);
}
