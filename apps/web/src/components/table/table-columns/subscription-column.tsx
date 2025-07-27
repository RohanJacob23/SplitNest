import { createColumnHelper, type FilterFn } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Subscription } from "@/lib/mock-dashboard-subscriptions-data";

const multiColumnFilterFn: FilterFn<Subscription> = (row, _, filterValue) => {
	const searchableRowContent =
		`${row.original.name} ${row.original.category}`.toLowerCase();

	const searchTerm = (filterValue ?? "").toLowerCase();
	return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Subscription> = (
	row,
	columnId,
	filterValue: string[],
) => {
	if (!filterValue?.length) return true;

	const status = row.getValue(columnId) as string;
	return filterValue.includes(status);
};

const columnHelper = createColumnHelper<Subscription>();

const customBadge = (value: string) => {
	switch (value) {
		case "paid":
			return (
				<Badge variant="outline" className="gap-1.5 rounded-full">
					<span
						className="size-1.5 rounded-full bg-emerald-500"
						aria-hidden="true"
					/>
					Paid
				</Badge>
			);
		case "pending":
			return (
				<Badge variant="outline" className="gap-1.5 rounded-full">
					<span
						className="size-1.5 rounded-full bg-amber-500"
						aria-hidden="true"
					/>
					Pending
				</Badge>
			);
		case "due":
			return (
				<Badge variant="outline" className="gap-1.5 rounded-full">
					<span
						className="size-1.5 rounded-full bg-red-500"
						aria-hidden="true"
					/>
					Due
				</Badge>
			);
		default:
			return <Badge>Unknown</Badge>;
	}
};

export const defaultSubscriptionColumns = [
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
	columnHelper.accessor("dueDate", {
		header: "Due Date",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("name", {
		header: "Name",
		cell: (info) => info.getValue(),
		filterFn: multiColumnFilterFn,
	}),
	columnHelper.accessor("owedAmount", {
		header: "Owed Amount",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("owedBy", {
		header: "Owed By",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("paidBy", {
		header: "Paid By",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("status", {
		cell: (info) => customBadge(info.getValue()),
		filterFn: statusFilterFn,
	}),
];
