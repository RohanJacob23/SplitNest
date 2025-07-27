import { useFormContext } from "@/hooks/form-context";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";

export default function SubmitButton({
	label,
	className,
	isLoading,
}: {
	label: string;
	className?: string;
	isLoading?: boolean;
}) {
	const form = useFormContext();

	return (
		<form.Subscribe
			selector={(state) => [state.isSubmitting, state.isValid]}
			children={([isSubmitting, isValid]) => (
				<Button
					type="submit"
					animate={{ x: !isValid ? [null, -5, 0, 5, 0] : undefined }}
					transition={{ x: { duration: 0.2 } }}
					disabled={isSubmitting}
					isLoading={isSubmitting || isLoading}
					className={cn("overflow-y-clip", className)}
				>
					{label}
				</Button>
			)}
		/>
	);
}
