import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import type * as React from "react";
import { CustomLoaderIcon } from "@/icons/loader";
import { swift } from "@/lib/easing";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 overflow-y-hidden whitespace-nowrap rounded-md font-medium text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
				destructive:
					"!text-destructive-foreground bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
				secondary:
					"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost:
					"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const MotionButton = motion.button;
const MotionSlot = motion.create(Slot);

function Button({
	className,
	spanClassname,
	variant,
	size,
	asChild = false,
	transition,
	whileTap = { scale: 0.9 },
	children,
	isLoading,
	...props
}: React.ComponentProps<typeof MotionButton> &
	VariantProps<typeof buttonVariants> & {
		isLoading?: boolean;
		asChild?: boolean;
		spanClassname?: string;
	}) {
	const Comp = asChild ? MotionSlot : MotionButton;

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			whileTap={whileTap}
			transition={{ ...swift, ...transition }}
			{...props}
		>
			{asChild ? (
				children
			) : (
				<AnimatePresence initial={false} mode="popLayout">
					{isLoading ? (
						<motion.span
							key="loader"
							initial={{ opacity: 0, y: -25 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 25 }}
							transition={swift}
							className="block"
						>
							<CustomLoaderIcon className="animate-spin duration-700" />
						</motion.span>
					) : (
						<motion.span
							key="label"
							initial={{ opacity: 0, y: -25 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 25 }}
							transition={swift}
							className={cn(
								"flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
								spanClassname,
							)}
						>
							{children}
						</motion.span>
					)}
				</AnimatePresence>
			)}
		</Comp>
	);
}

export { Button, buttonVariants };
