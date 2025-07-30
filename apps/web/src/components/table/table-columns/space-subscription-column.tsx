import { createColumnHelper, type FilterFn } from "@tanstack/react-table";
import type { SpaceSubscription } from "@/utils/orpc";

const columnHelper = createColumnHelper<SpaceSubscription>();

export const defaultSpaceSubscriptionColumns = [
	columnHelper.accessor("id", {
		header: "ID",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("amount", {
		header: "Amount",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("category", {
		header: "Category",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("dueDay", {
		header: "Due Day",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("name", {
		header: "Name",
		cell: (info) => info.getValue(),
		// filterFn: multiColumnFilterFn,
	}),
	// columnHelper.accessor("", {
	// 	header: "Owed Amount",
	// 	cell: (info) => info.getValue(),
	// }),
	// columnHelper.accessor("owedBy", {
	// 	header: "Owed By",
	// 	cell: (info) => info.getValue(),
	// }),
	// columnHelper.accessor("paidBy", {
	// 	header: "Paid By",
	// 	cell: (info) => info.getValue(),
	// }),
	// columnHelper.accessor("status", {
	// 	cell: (info) => customBadge(info.getValue()),
	// 	filterFn: statusFilterFn,
	// }),
];
