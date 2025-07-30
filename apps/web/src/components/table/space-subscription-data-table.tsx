import { useSuspenseQuery } from "@tanstack/react-query";
import {
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useState } from "react";
import { orpc } from "@/utils/orpc";
import { Input } from "../ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { defaultSpaceSubscriptionColumns } from "./table-columns/space-subscription-column";

export default function SpaceSubscriptionDataTable({
	spaceId,
}: {
	spaceId: number;
}) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const { data: subscriptions } = useSuspenseQuery(
		orpc.subscriptions.listAll.queryOptions({ input: { spaceId } }),
	);

	const table = useReactTable({
		data: subscriptions,
		columns: defaultSpaceSubscriptionColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnFiltersChange: setColumnFilters,
		state: { columnFilters },
		initialState: { pagination: { pageSize: 5 } },
	});

	return (
		<div className="grid">
			{/* filter input */}
			<div className="flex items-center gap-2 py-4">
				<div className="relative w-full max-w-sm">
					<Input
						placeholder="Filter by names or categories..."
						value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
						onChange={(e) =>
							table.getColumn("name")?.setFilterValue(e.target.value)
						}
					/>
					<div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
						<Search size={16} aria-hidden="true" />
					</div>
				</div>
			</div>

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={defaultSpaceSubscriptionColumns.length}
								className="h-24 text-center"
							>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* pagination footer */}
			<DataTablePagination table={table} />
		</div>
	);
}
