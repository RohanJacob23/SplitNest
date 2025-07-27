import type { ComponentProps } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "./drawer";

function Modal(props: ComponentProps<typeof Drawer | typeof Dialog>) {
	const isMobile = useIsMobile();

	if (isMobile) return <Drawer {...props} />;
	return <Dialog {...props} />;
}

function ModalTrigger(
	props: ComponentProps<typeof DrawerTrigger | typeof DialogTrigger>,
) {
	const isMobile = useIsMobile();

	if (isMobile) return <DrawerTrigger {...props} />;
	return <DialogTrigger {...props} />;
}

function ModalContent(
	props: ComponentProps<typeof DrawerContent | typeof DialogContent>,
) {
	const isMobile = useIsMobile();

	if (isMobile) return <DrawerContent {...props} />;
	return <DialogContent {...props} />;
}

function ModalHeader(
	props:
		| ComponentProps<typeof DrawerHeader>
		| ComponentProps<typeof DialogHeader>,
) {
	const isMobile = useIsMobile();

	if (isMobile) return <DrawerHeader {...props} />;
	return <DialogHeader {...props} />;
}

function ModalTitle(
	props:
		| ComponentProps<typeof DrawerTitle>
		| ComponentProps<typeof DialogTitle>,
) {
	const isMobile = useIsMobile();

	if (isMobile) return <DrawerTitle {...props} />;
	return <DialogTitle {...props} />;
}

function ModalDescription(
	props:
		| ComponentProps<typeof DrawerDescription>
		| ComponentProps<typeof DialogDescription>,
) {
	const isMobile = useIsMobile();

	if (isMobile) return <DrawerDescription {...props} />;
	return <DialogDescription {...props} />;
}

function ModalFooter(
	props:
		| ComponentProps<typeof DrawerFooter>
		| ComponentProps<typeof DialogFooter>,
) {
	const isMobile = useIsMobile();

	if (isMobile) return <DrawerFooter {...props} />;
	return <DialogFooter {...props} />;
}

function ModalClose(
	props:
		| ComponentProps<typeof DrawerClose>
		| ComponentProps<typeof DialogClose>,
) {
	const isMobile = useIsMobile();

	if (isMobile) return <DrawerClose {...props} />;
	return <DialogClose {...props} />;
}

export {
	Modal,
	ModalTrigger,
	ModalContent,
	ModalHeader,
	ModalTitle,
	ModalDescription,
	ModalFooter,
	ModalClose,
};
