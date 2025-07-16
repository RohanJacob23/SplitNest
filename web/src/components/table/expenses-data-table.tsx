import { expensesMockData } from '@/lib/mock-dashboard-expenses'
import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { defaultExpenseColumns } from './table-columns/expenses-column'
import { Input } from '../ui/input'
import { FilterIcon, Search } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { DataTablePagination } from './data-table-pagination'

export default function ExpensesDataTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: expensesMockData,
    columns: defaultExpenseColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
    initialState: { pagination: { pageSize: 5 } },
  })

  const uniqueStatusValues = useMemo<string[]>(() => {
    return Array.from(
      table.getColumn('status')?.getFacetedUniqueValues().keys() ?? [],
    ).sort()
  }, [table.getColumn('status')?.getFacetedUniqueValues()])

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn('status')?.getFilterValue() as string[]
    return filterValue ?? []
  }, [table.getColumn('status')?.getFilterValue()])

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn('status')?.getFilterValue() as string[]

    const newFilterValue = filterValue ? [...filterValue] : []

    if (checked) {
      newFilterValue.push(value)
    } else {
      const index = newFilterValue.indexOf(value)
      if (index > -1) {
        newFilterValue.splice(index, 1)
      }
    }

    table
      .getColumn('status')
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
  }

  return (
    <div className="grid">
      {/* filter input */}
      <div className="flex items-center gap-2 py-4">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Filter by categories or descriptions..."
            value={
              (table.getColumn('category')?.getFilterValue() as string) ?? ''
            }
            onChange={(e) =>
              table.getColumn('category')?.setFilterValue(e.target.value)
            }
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
            <Search size={16} aria-hidden="true" />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <FilterIcon
                className="-me-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Status
              {selectedStatuses.length > 0 && (
                <span className="dark:bg-primary-950 bg-primary-200 text-primary-900 dark:text-primary-200 inline-flex size-6 items-center justify-center rounded-full border p-1 font-[inherit] text-xs">
                  {selectedStatuses.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="bottom"
            className="w-(--radix-dropdown-menu-trigger-width)"
          >
            {uniqueStatusValues.map((status, i) => (
              <DropdownMenuCheckboxItem
                key={i}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={(checked) =>
                  handleStatusChange(checked, status)
                }
                className="[&_svg]:text-primary"
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
                data-state={row.getIsSelected() && 'selected'}
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
                colSpan={defaultExpenseColumns.length}
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
  )
}
