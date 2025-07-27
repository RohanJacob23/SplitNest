import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { swift } from "@/lib/easing";
import { cn } from "@/lib/utils";

const AlertDialogContext = React.createContext<{ open: boolean }>({
	open: false,
});

const useAlertDialog = () => React.useContext(AlertDialogContext);

function AlertDialog({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
	const [open, setOpen] = React.useState(
		props?.open ?? props.defaultOpen ?? false,
	);

	React.useEffect(() => {
		if (props?.open !== undefined) setOpen(props.open);
	}, [props?.open]);

	const handleOpenChange = React.useCallback(
		(open: boolean) => {
			setOpen(open);
			props.onOpenChange?.(open);
		},
		[props],
	);

	return (
		<AlertDialogContext.Provider
			value={{ open }}
			children={
				<AlertDialogPrimitive.Root
					data-slot="alert-dialog"
					open={open}
					onOpenChange={handleOpenChange}
					{...props}
				/>
			}
		/>
	);
}

function AlertDialogTrigger({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
	return (
		<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
	);
}

function AlertDialogPortal({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
	return (
		<AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
	);
}

function AlertDialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
	return (
		<AlertDialogPrimitive.Overlay
			data-slot="alert-dialog-overlay"
			className={cn(
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDialogContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
	const { open } = useAlertDialog();

	return (
		<AnimatePresence>
			{open && (
				<AlertDialogPortal forceMount>
					<AlertDialogOverlay
						asChild
						children={
							<motion.div
								initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
								animate={{ opacity: 1, backdropFilter: "blur(2px)" }}
								exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
								transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
							/>
						}
					/>
					<AlertDialogPrimitive.Content
						asChild
						data-slot="alert-dialog-content"
						className={cn(
							"fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg",
							className,
						)}
						{...props}
					>
						<motion.div
							initial={{ opacity: 0, y: "-40%", scale: 0.95 }}
							animate={{ opacity: 1, y: "-50%", scale: 1 }}
							exit={{ opacity: 0, y: "-40%", scale: 0.95 }}
							style={{ x: "-50%", y: "-50%" }}
							transition={swift}
						>
							{children}
						</motion.div>
					</AlertDialogPrimitive.Content>
				</AlertDialogPortal>
			)}
		</AnimatePresence>
	);
}

function AlertDialogHeader({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-dialog-header"
			className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
			{...props}
		/>
	);
}

function AlertDialogFooter({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-dialog-footer"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDialogTitle({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
	return (
		<AlertDialogPrimitive.Title
			data-slot="alert-dialog-title"
			className={cn("font-semibold text-lg", className)}
			{...props}
		/>
	);
}

function AlertDialogDescription({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
	return (
		<AlertDialogPrimitive.Description
			data-slot="alert-dialog-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function AlertDialogAction({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
	return (
		<AlertDialogPrimitive.Action
			className={cn(buttonVariants(), className)}
			{...props}
		/>
	);
}

function AlertDialogCancel({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
	return (
		<AlertDialogPrimitive.Cancel
			className={cn(buttonVariants({ variant: "outline" }), className)}
			{...props}
		/>
	);
}

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
};
