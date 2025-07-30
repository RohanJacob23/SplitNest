import type { ComponentProps } from "react";
import { useFieldContext } from "@/hooks/form-context";
import { cn } from "@/lib/utils";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";

export default function TextField({
	label,
	className,
	...props
}: { label: string } & ComponentProps<typeof Input>) {
	// The `Field` infers that it should have a `value` type of `string`
	const field = useFieldContext<string>();

	return (
		<div className="flex-auto *:not-first:mt-2">
			<Label htmlFor={label}>{label}</Label>
			<Input
				id={label}
				value={field.state.value}
				aria-invalid={!field.state.meta.isValid}
				onChange={(e) => field.handleChange(e.target.value)}
				onBlur={field.handleBlur}
				className={cn("peer", className)}
				// disabled={field.state.meta.}
				{...props}
			/>
			{!field.state.meta.isValid &&
				field.state.meta.errors.map((error, i) => (
					<span
						key={i}
						className="mt-2 text-xs peer-aria-invalid:text-destructive"
					>
						{error.message}
					</span>
				))}
		</div>
	);
}
